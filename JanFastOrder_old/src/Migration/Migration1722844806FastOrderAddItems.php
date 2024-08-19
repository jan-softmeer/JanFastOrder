<?php declare(strict_types=1);

namespace JanFastOrder\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @internal
 */
#[Package('core')]
class Migration1722844806FastOrderAddItems extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1722844806;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE `added_items` (
                `id` BINARY(16) NOT NULL,
                `session_id` VARCHAR(255) NOT NULL,
                `article_id` VARCHAR(255) NOT NULL,
                `quantity` INT(11) NOT NULL,
                `price` DECIMAL(10,2) NOT NULL,
                `created_at` DATETIME(3) NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ');
    }
}
