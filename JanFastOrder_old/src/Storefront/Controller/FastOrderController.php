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


#[Route(defaults: ['_routeScope' => ['storefront']])]
class FastOrderController extends StorefrontController
{

    private $exampleProducts;
    private LineItemFactoryRegistry $factory;
    private CartService $cartService;
    private AddedItemsRepository $addedItemsRepository;


    public function __construct(LineItemFactoryRegistry $factory, CartService $cartService, AddedItemsRepository $addedItemsRepository)
    {
        $this->exampleProducts = [
            ["name" => "Product 1", "id" => "01912165990f73338fc7c873be69747d", "stack" => 10, "price" => 10.00],
            ["name" => "Product 2", "id" => "01912164e9777333a7214c1ae8f66fed", "stack" => 20, "price" => 10.40],
            ["name" => "Product 3", "id" => "0191216520e7737c8162602cbcbd34b8", "stack" => 5, "price" => 8.99],
            ["name" => "Product 4", "id" => "01912165990f73338fc7c873ba0cff3b", "stack" => 8, "price" => 14.99],
            ["name" => "Product 5", "id" => "01912165990f73338fc7c873ba9c0762", "stack" => 12, "price" => 209.00],
            ["name" => "Product 6", "id" => "01912165990f73338fc7c873bb2f0f34", "stack" => 10, "price" => 101.00],
            ["name" => "Product 7", "id" => "01912165990f73338fc7c873bb693e41", "stack" => 10, "price" => 310.00],
            ["name" => "Product 8", "id" => "01912165990f73338fc7c873bb693e40", "stack" => 10, "price" => 210.00],
            ["name" => "Product 9", "id" => "01912165990f73338fc7c873bbab7d63", "stack" => 10, "price" => 510.00],
            ["name" => "Product 10", "id" => "01912165990f73338fc7c873bc0a1189", "stack" => 10, "price" => 90.49],
            ["name" => "Product 11", "id" => "01912165990f73338fc7c873bd00502e", "stack" => 10, "price" => 10.28],
            ["name" => "Product 12", "id" => "01912165990f73338fc7c873bd09de70", "stack" => 10, "price" => 10.10],
            ["name" => "Product 13", "id" => "01912165990f73338fc7c873bd972777", "stack" => 10, "price" => 10.70],
            ["name" => "Product 14", "id" => "01912165990f73338fc7c873bde34b5c", "stack" => 10, "price" => 19.00],
        ];

        $this->factory = $factory;
        $this->cartService = $cartService;
        $this->addedItemsRepository = $addedItemsRepository;
    }

    #[Route(
        path: '/fastorder',
        name: 'jan.fastorder.show',
        methods: ['GET']
    )]
    public function showFastOrder(Request $request, SalesChannelContext $context): Response
    {
        return $this->renderStorefront('@JanFastOrder/storefront/page/fastorder.html.twig', ["exampleProducts" => $this->exampleProducts]);
    }

    #[Route(
        path: '/fastorder/submit-xml',
        name: 'jan.fastorder.submit_xml',
        methods: ['POST'],
        defaults: ['XmlHttpRequest' => 'true']
    )]
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
                'type' => LineItem::PRODUCT_LINE_ITEM_TYPE, // Results in 'product'
                'referencedId' => $articleId, // this is not a valid UUID, change this to your actual ID!
                'quantity' => $quantity,
                'payload' => []
            ], $context);

            $lineItem->setPrice($this->getProductPrice($articleId, $context));
    
            $this->cartService->add($cart, $lineItem, $context); // shopping cart is still empty

            $this->addedItemsRepository->addItem($sessionId, $articleId, $quantity, $this->getExampleProductsProductById($articleId)["price"]);
        }

        $this->cartService->recalculate($cart, $context);

        return new JsonResponse(['success' => true]);
    }


    private function isArticleAvailable(string $articleId, int $quantity): bool
    {
        $product = $this->getExampleProductsProductById($articleId);
        return $product && $product != null && $product["stack"] >= $quantity;
    }

    private function getExampleProductsProductById($id)
    {
        foreach ($this->exampleProducts as $product) {
            if ($product['id'] === $id) {
                return $product;
            }
        }

        return null;
    }

    private function getProductPrice(string $articleId, SalesChannelContext $context): CalculatedPrice
    {
        $product = $this->getExampleProductsProductById($articleId);
        if(!$product) {
            throw new \Exception('Product not found');
        }

        $grossPrice = $product["price"];
        $taxAmount = $grossPrice * 0.19; // 19% VAT

        $taxCollection = new CalculatedTaxCollection([
            new CalculatedTax($taxAmount, 19, $grossPrice)
        ]);

        $calculatedPrice = new CalculatedPrice(
            $grossPrice, // Net price
            $grossPrice, // Gross price
            $taxCollection,
            new TaxRuleCollection()
        );

        return $calculatedPrice;
    }
}
