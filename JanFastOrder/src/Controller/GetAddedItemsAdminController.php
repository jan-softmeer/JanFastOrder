<?php declare(strict_types=1);

namespace JanFastOrder\Controller;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\Context;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Shopware\Storefront\Controller\StorefrontController;

#[Route(defaults: ['_routeScope' => ['api']])]
class GetAddedItemsAdminController extends StorefrontController
{
    private EntityRepository $addedProductsRepository;
    
    public function __construct(EntityRepository $addedProductsRepository)
    {
        $this->addedProductsRepository = $addedProductsRepository;
    }
    
    //TODO: Route wird ignoriert (Also es kommt ein 404 wenn man es aufruft)
    #[Route(path: '/api/fastorder/get-added-items-admin', name: 'jan.fastorder.get-added-items-admin', methods: ['GET'])]
    public function getAddedProductsAdmin(Request $request, Context $context): JsonResponse
    {
        $criteria = new Criteria();
        $addedItems = $this->addedProductsRepository->search($criteria, $context);

        return new JsonResponse($addedItems->getEntities());
    }
}
