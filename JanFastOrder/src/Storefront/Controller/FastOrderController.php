<?php declare(strict_types=1);

namespace JanFastOrder\Storefront\Controller;

use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Checkout\Cart\Price\Struct\CalculatedPrice;
use Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTaxCollection;
use Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTax;
use Shopware\Core\Checkout\Cart\Tax\Struct\TaxRuleCollection;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Shopware\Core\Framework\Context;
use Shopware\Core\Checkout\Cart\Cart;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\LineItemFactoryRegistry;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use JanFastOrder\Repository\AddedItemsRepository;
use JanFastOrder\Repository\GetAllActiveAndAvailableProducts;
use Shopware\Core\Content\Product\ProductEntity;
use Shopware\Core\System\Currency\CurrencyEntity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;


#[Route(defaults: ['_routeScope' => ['storefront']])]
class FastOrderController extends StorefrontController
{

    private LineItemFactoryRegistry $factory;
    private CartService $cartService;
    private GetAllActiveAndAvailableProducts $getAllActiveProducts;
    private AddedItemsRepository $addedItemsRepository;
    private $allActiveProducts;
    private $allProductsForStoreFront;
    private EntityRepository $mediaRepository;
    private SystemConfigService $systemConfigService;


    public function __construct(LineItemFactoryRegistry $factory, CartService $cartService, GetAllActiveAndAvailableProducts $getAllActiveProducts, AddedItemsRepository $addedItemsRepository, EntityRepository $mediaRepository, SystemConfigService $systemConfigService)
    {
        $this->factory = $factory;
        $this->cartService = $cartService;
        $this->getAllActiveAndAvailableProducts = $getAllActiveProducts;
        $this->addedItemsRepository = $addedItemsRepository;
        $this->allActiveProducts = $this->getAllActiveAndAvailableProducts->getAllActiveAndAvailableProducts();
        $this->mediaRepository = $mediaRepository;
        $this->systemConfigService = $systemConfigService;

        $all_products_for_storefront = [];
        foreach($this->allActiveProducts as $product) {

            if($product["childCount"] === null) { // Product is Child

                $parentProductNumber = strstr($product["productNumber"], '.', true);

                $parent = $this->getProductOfAllActiveAndAvaibleProductsByProductNumber($parentProductNumber);
                if($parent !== null) {

                    $productName = $parent["name"];

                    $pricesCollection = $parent["price"];
                    if($pricesCollection !== null) {
                        $grossPrice = $pricesCollection->first()->getGross();
                    }

                    $media_url = $this->getProductMediaUrlUrl($parent["media"]);
                }

            } 
            
            else {

                $productName = $product["name"];

                $pricesCollection = $product["price"];
                if($pricesCollection !== null) {
                    $grossPrice = $pricesCollection->first()->getGross();
                }

                $media_url = $this->getProductMediaUrlUrl($product["media"]);
            }


            if(!isset($productName) || !isset($grossPrice) || $product["childCount"] > 0) { // if is Parent or doesnt have name / price => continue
                continue;
            }


            $product_to_add = [];

            $product_to_add["id"] = $product["id"];
            $product_to_add["productNumber"] = $product["productNumber"];
            $product_to_add["name"] = $productName;
            $product_to_add["grossPrice"] = $grossPrice;
            $product_to_add["availableStock"] = $product["availableStock"];
            $product_to_add["shippingFree"] = $product["shippingFree"];
            $product_to_add["mediaUrl"] = $media_url;

            $all_products_for_storefront[] = $product_to_add;
        }

        // sort by productNumber ASC
        usort($all_products_for_storefront, function ($a, $b) {
            return strcmp($a['productNumber'], $b['productNumber']);
        });

        $this->allProductsForStoreFront = $all_products_for_storefront;
    }

    
    #[Route(path: '/fastorder', name: 'jan.fastorder.show', methods: ['GET'])]
    public function showFastOrder(Request $request, SalesChannelContext $context): Response
    {
        $note = $this->systemConfigService->get('JanFastOrder.config.textField') ?? '';
        return $this->renderStorefront('@JanFastOrder/storefront/page/fastorder.html.twig', ["allProductsForStoreFront" => json_encode($this->allProductsForStoreFront), "note" => $note]);
    }

    #[Route(path: '/fastorder/submit-xml', name: 'jan.fastorder.submit_xml', methods: ['POST'], defaults: ['XmlHttpRequest' => 'true'])]
    public function submitFastOrderXmlHttpRequest(Request $request, SalesChannelContext $context): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !is_array($data)) {
            return new JsonResponse(['success' => false, 'message' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $cart = $this->cartService->getCart($context->getToken(), $context);

        $sessionId = Uuid::randomHex();

        foreach ($data as $articleId => $quantity) {
            if (!$this->isArticleAvailable($articleId, $quantity)) {
                return new JsonResponse(['success' => false, 'message' => 'Article not available' ], Response::HTTP_BAD_REQUEST);
            }

            $lineItem = $this->factory->create([
                'type' => LineItem::PRODUCT_LINE_ITEM_TYPE,
                'referencedId' => $articleId,
                'quantity' => $quantity,
                'payload' => []
            ], $context);
    
            $this->cartService->add($cart, $lineItem, $context);

            $product = $this->getProductOfStoreFrontById($articleId);

            $this->addedItemsRepository->addItem($sessionId, $product["productNumber"], $quantity, $product["grossPrice"]);
        }

        $this->cartService->recalculate($cart, $context);

        return new JsonResponse(['success' => true]);
    }

    private function isArticleAvailable(string $articleId, int $quantity): bool
    {
        $product = $this->getProductOfStoreFrontById($articleId);
        return $product && $product != null && $product["availableStock"] >= $quantity;
    }

    private function getProductOfStoreFrontById($id)
    {
        foreach ($this->allProductsForStoreFront as $product) {
            if ($product['id'] === $id) {
                return $product;
            }
        }

        return null;
    }

    private function getProductOfAllActiveAndAvaibleProductsByProductNumber($productNumber)
    {
        foreach ($this->allActiveProducts as $product) {
            if ($product['productNumber'] === $productNumber) {
                return $product;
            }
        }

        return null;
    }

    private function getProductMediaUrlUrl($product_media) 
    {
        $firstMediaEntity = $product_media->getMedia()->first();

        if ($firstMediaEntity instanceof \Shopware\Core\Content\Media\MediaEntity) {
            return $firstMediaEntity->getUrl();
        }

        return "";
    }
}
