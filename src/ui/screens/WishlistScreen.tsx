import React from 'react';
import { FlatList, View, type ListRenderItemInfo } from 'react-native';

import type { WishlistItem } from '@domain/wishlist/types';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { PlantListItemCard } from '@ui/components/PlantListItemCard';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useWishlist } from '@ui/hooks/useWishlist';
import { useRootNavigation } from '@navigation/navigationHelpers';
import { useTheme } from '@ui/theme';

export const WishlistScreen = (): React.ReactElement => {
  const theme = useTheme();
  const navigation = useRootNavigation();
  const wishlist = useWishlist();

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<WishlistItem>) => (
      <PlantListItemCard
        title={item.name}
        subtitle={item.scientificName}
        imageUrl={item.imageUrl}
        onPress={() =>
          navigation.navigate('PlantDetail', {
            id: item.id,
            source: item.source,
          })
        }
        actionLabel="Remove"
        onAction={() => wishlist.toggle(item)}
      />
    ),
    [navigation, wishlist],
  );

  let content = null;
  if (wishlist.isLoading) {
    content = <LoadingState message="Loading wishlist..." />;
  } else if (wishlist.error) {
    content = (
      <ErrorState
        title="Wishlist unavailable"
        message={wishlist.error.message}
        actionLabel="Retry"
        onAction={wishlist.refresh}
      />
    );
  } else if (wishlist.items.length === 0) {
    content = (
      <EmptyState
        title="No saved plants"
        message="Save plants you want to grow later."
      />
    );
  } else {
    content = (
      <FlatList
        data={wishlist.items}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.source}:${item.id}`}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
      />
    );
  }

  return <ScreenLayout title="Wishlist" footerText="Cvetko">{content}</ScreenLayout>;
};
