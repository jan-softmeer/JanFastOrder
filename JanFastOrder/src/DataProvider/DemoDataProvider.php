<?php

declare(strict_types=1);

namespace JanFastOrder\DataProvider;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Log\Package;

#[Package('services-settings')]
abstract class DemoDataProvider
{
    abstract public function getAction(): string;

    abstract public function getEntity(): string;

    /**
     * @return list<array<string, mixed>>
     */
    abstract public function getPayload(): array;

    public function finalize(Context $context): void {}
}
