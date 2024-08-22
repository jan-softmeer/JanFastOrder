<?php declare(strict_types=1);

namespace JanFastOrder\Core\Content;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FloatField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\CreatedAtField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Field\UpdatedAtField;

class GetAddedItemsAdminDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'added_items_from_fastorder';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required()), // Primary key
            (new StringField('session_id', 'sessionId'))->addFlags(new Required()), // Session ID field
            (new StringField('product_number', 'productNumber'))->addFlags(new Required()), // Product number field
            (new IntField('quantity', 'quantity'))->addFlags(new Required()), // Quantity field
            (new FloatField('price', 'price'))->addFlags(new Required()), // Price field
            new CreatedAtField('created_at', 'createdAt'), // Created at field
            new UpdatedAtField('created_at', 'createdAt') // Updated at field (same as created_at)
        ]);
    }
}
