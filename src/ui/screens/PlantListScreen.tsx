import React from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';

import { createDefaultPlantRepositories } from '@data/plants/factory';
import type { PlantRepository } from '@data/plants/repository';
import { useRootNavigation } from '@navigation/navigationHelpers';
import type { PlantListItem } from '@domain/plants/types';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { PlantListItemCard } from '@ui/components/PlantListItemCard';
import { PlantSearchBar } from '@ui/components/PlantSearchBar';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { usePlantFilters } from '@ui/hooks/usePlantFilters';
import { usePlantList } from '@ui/hooks/usePlantList';
import { useWishlist } from '@ui/hooks/useWishlist';
import { wishlistItemFromList } from '@utils/wishlist';
import { useTheme } from '@ui/theme';

type PlantListScreenProps = {
  repository?: PlantRepository;
};

export const PlantListScreen = ({ repository }: PlantListScreenProps): React.ReactElement => {
  const theme = useTheme();
  const navigation = useRootNavigation();
  const { filters, setQuery, clearFilters } = usePlantFilters();
  const wishlist = useWishlist();
  const resolvedRepository = React.useMemo(() => {
    if (repository) {
      return repository;
    }
    return createDefaultPlantRepositories()?.listRepository ?? null;
  }, [repository]);
  const { items, isLoading, error, refresh, loadMore, isRefreshing, isLoadingMore } =
    usePlantList({
      repository: resolvedRepository,
      source: 'perenual',
      filters,
    });

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PlantListItem>) => (
      <PlantListItemCard
        title={item.commonName ?? item.scientificName}
        subtitle={item.commonName ? item.scientificName : null}
        imageUrl={item.imageUrl}
        onPress={() =>
          navigation.navigate('PlantDetail', {
            id: item.id,
            source: item.source,
          })
        }
        actionLabel={wishlist.isInWishlist(item.id, item.source) ? 'Remove' : 'Wishlist'}
        onAction={() => wishlist.toggle(wishlistItemFromList(item))}
      />
    ),
    [navigation, wishlist],
  );

  const keyExtractor = React.useCallback((item: PlantListItem) => `${item.source}:${item.id}`, []);

  let content = null;
  if (isLoading) {
    content = <LoadingState message="Loading plants..." />;
  } else if (error) {
    content = (
      <ErrorState
        title="Could not load plants"
        message={error.message}
        actionLabel="Retry"
        onAction={refresh}
      />
    );
  } else if (items.length === 0) {
    content = (
      <EmptyState
        title="No plants found"
        message="Try adjusting your search or filters."
      />
    );
  } else {
    content = (
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
        onEndReachedThreshold={0.6}
        onEndReached={loadMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        initialNumToRender={8}
        windowSize={7}
        maxToRenderPerBatch={8}
        removeClippedSubviews
        ListFooterComponent={
          isLoadingMore ? <LoadingState message="Loading more..." /> : null
        }
      />
    );
  }

  return (
    <ScreenLayout title="Browse plants" footerText="Cvetko">
      <View style={[styles.header, { gap: theme.spacing.md, marginBottom: theme.spacing.lg }]}>
        <PlantSearchBar query={filters.query ?? ''} onChangeQuery={setQuery} onClear={clearFilters} />
      </View>
      {content}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {},
});
