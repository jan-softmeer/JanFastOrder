<?php

namespace JanFastOrder\Storefront\Controller;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;

class EntityRepository
{
    private $entityRepository;

    public function __construct(EntityRepositoryInterface $entityRepository)
    {
        $this->entityRepository = $entityRepository;
    }

    /**
     * Find products by their IDs.
     *
     * @param array $ids
     * @return EntityCollection
     */
    public function findProductsByIds(array $ids): EntityCollection
    {
        $criteria = new Criteria($ids);
        return $this->entityRepository->search($criteria, Context::createDefaultContext())->getEntities();
    }

    /**
     * Find all active products.
     *
     * @return EntityCollection
     */
    public function findAllActiveProducts(): EntityCollection
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('active', true));
        return $this->entityRepository->search($criteria, Context::createDefaultContext())->getEntities();
    }
}
