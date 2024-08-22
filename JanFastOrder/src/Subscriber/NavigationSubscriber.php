<?php

namespace JanFastOrder\Subscriber;

use Shopware\Core\Framework\Context;
use Shopware\Core\System\SalesChannel\Event\SalesChannelContextResolvedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class NavigationSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            SalesChannelContextResolvedEvent::class => 'onSalesChannelContextResolved',
        ];
    }

    public function onSalesChannelContextResolved(SalesChannelContextResolvedEvent $event): void
    {
        $navigation = $event->getSalesChannelContext()->getSalesChannel()->getNavigation();

        $navigation->addLink([
            'label' => 'Fast Order',
            'url' => '/fastorder',
        ]);
    }
}
