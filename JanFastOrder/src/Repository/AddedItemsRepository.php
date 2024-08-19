<?php declare(strict_types=1);

namespace JanFastOrder\Repository;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Uuid\Uuid;

class AddedItemsRepository
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function addItem(string $session_id, string $productNumber, int $quantity, float $price): void
    {
        $this->connection->insert('added_products_from_fastorder', [
            'id' => Uuid::randomBytes(),
            'session_id' => $session_id,
            'product_number' => $productNumber,
            'quantity' => $quantity,
            'price' => $price,
            'created_at' => (new \DateTime())->format('Y-m-d H:i:s'),
        ]);
    }
}
