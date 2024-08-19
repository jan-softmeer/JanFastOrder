<?php declare(strict_types=1);

namespace JanFastOrder\Repository;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Context;


class GetAllActiveAndAvailableProducts
{
    private $productRepository;

    public function __construct(EntityRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAllActiveAndAvailableProducts(): array
    {
        $criteria = new Criteria();
        $criteria->addAssociation('media');
    
        $products = $this->productRepository->search($criteria, Context::createDefaultContext());

        $productArray = [];
        foreach ($products->getEntities() as $product) {

            if($product->getAvailable() && ($product->getActive() == true || $product->getActive() === null)) {
                $productArray[] = $product->jsonSerialize();
            }
        }

        return $productArray;
    }
}
