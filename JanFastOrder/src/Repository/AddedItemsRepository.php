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

    public function addItem(string $session_id, string $articleId, int $quantity, float $price): void
    {
        $this->connection->insert('added_items', [
            'id' => Uuid::randomBytes(),
            'session_id' => $session_id,
            'article_id' => $articleId,
            'quantity' => $quantity,
            'price' => $price,
            'created_at' => (new \DateTime())->format('Y-m-d H:i:s'),
        ]);
    }
}
