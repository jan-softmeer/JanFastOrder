<?php declare(strict_types=1);

namespace JanFastOrder\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @internal
 */
#[Package('core')]
class Migration1724343254AddedItemsFromFastorder extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1724343254;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `added_items_from_fastorder` (
                `id` BINARY(16) NOT NULL,
                `session_id` VARCHAR(255) NOT NULL,
                `product_number` VARCHAR(255) NOT NULL,
                `quantity` INT(11) NOT NULL,
                `price` DECIMAL(10,2) NOT NULL,
                `created_at` DATETIME(3) NOT NULL,
                `updated_at` DATETIME(3) NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        $connection->executeStatement('
            DROP TABLE IF EXISTS `added_items_from_fastorder`;
        ');
    }
}
