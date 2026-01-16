import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import { createDefaultPlantRepositories } from '@data/plants/factory';
import type { PlantRepository } from '@data/plants/repository';
import { useRootNavigation } from '@navigation/navigationHelpers';
import type { PlantListItem } from '@domain/plants/types';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { Button } from '@ui/components/Button';
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
  const {
    filters,
    setQuery,
    setEdible,
    setPoisonous,
    setWatering,
    setSunlight,
    setIndoor,
    clearFilters,
  } = usePlantFilters();
  const wishlist = useWishlist();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(filters.query ?? '');
  const resolvedRepository = React.useMemo(() => {
    if (repository) {
      return repository;
    }
    return createDefaultPlantRepositories()?.listRepository ?? null;
  }, [repository]);
  const { items, isLoading, error, refresh, loadMore, isRefreshing, isLoadingMore } =
    usePlantList({
      repository: resolvedRepository,
      filters,
    });

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery(searchInput.trim());
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchInput, setQuery]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PlantListItem>) => (
      <PlantListItemCard
        title={item.commonName ?? item.scientificName}
        subtitle={item.commonName ? item.scientificName : null}
        imageUrl={item.imageUrl}
        onPress={() =>
          navigation.navigate('PlantDetail', {
            id: item.id,
          })
        }
        actionLabel={wishlist.isInWishlist(item.id) ? 'Remove' : 'Wishlist'}
        onAction={() => wishlist.toggle(wishlistItemFromList(item))}
        secondaryActionLabel="More"
        onSecondaryAction={() =>
          navigation.navigate('PlantDetail', {
            id: item.id,
          })
        }
      />
    ),
    [navigation, wishlist],
  );

  const keyExtractor = React.useCallback((item: PlantListItem) => item.id, []);

  const renderBooleanFilter = (
    label: string,
    value: boolean | undefined,
    onChange: (next: boolean | undefined) => void,
  ) => (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.caption,
          marginBottom: theme.spacing.xs,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <Button
          label="All"
          variant={value === undefined ? 'primary' : 'secondary'}
          onPress={() => onChange(undefined)}
        />
        <Button
          label="Yes"
          variant={value === true ? 'primary' : 'secondary'}
          onPress={() => onChange(true)}
        />
        <Button
          label="No"
          variant={value === false ? 'primary' : 'secondary'}
          onPress={() => onChange(false)}
        />
      </View>
    </View>
  );

  const renderOptionFilter = (
    label: string,
    value: string | undefined,
    options: { label: string; value: string }[],
    onChange: (next: string | undefined) => void,
  ) => (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.caption,
          marginBottom: theme.spacing.xs,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <Button
          label="All"
          variant={value === undefined ? 'primary' : 'secondary'}
          onPress={() => onChange(undefined)}
        />
        {options.map((option) => (
          <Button
            key={option.value}
            label={option.label}
            variant={value === option.value ? 'primary' : 'secondary'}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </View>
  );

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
    <ScreenLayout title="Browse plants">
      <View style={[styles.header, { gap: theme.spacing.md, marginBottom: theme.spacing.lg }]}>
        <PlantSearchBar
          query={searchInput}
          onChangeQuery={setSearchInput}
          onClear={() => {
            setSearchInput('');
            clearFilters();
          }}
        />
        <View style={{ alignSelf: 'flex-start' }}>
          <Button label="Filters" variant="secondary" onPress={() => setIsFilterOpen(true)} />
        </View>
      </View>
      {content}
      <Modal animationType="slide" transparent visible={isFilterOpen} onRequestClose={() => setIsFilterOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsFilterOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.sheetHandle, { backgroundColor: theme.colors.border }]} />
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: theme.typography.sizes.h2,
              marginBottom: theme.spacing.sm,
            }}
          >
            Filters
          </Text>
          <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.lg }}>
            {renderBooleanFilter('Edible', filters.edible, setEdible)}
            {renderBooleanFilter('Poisonous', filters.poisonous, setPoisonous)}
            {renderOptionFilter(
              'Watering',
              filters.watering,
              [
                { label: 'Frequent', value: 'frequent' },
                { label: 'Average', value: 'average' },
                { label: 'Minimum', value: 'minimum' },
                { label: 'None', value: 'none' },
              ],
              setWatering,
            )}
            {renderOptionFilter(
              'Sunlight',
              filters.sunlight,
              [
                { label: 'Full shade', value: 'full_shade' },
                { label: 'Part shade', value: 'part_shade' },
                { label: 'Sun + shade', value: 'sun-part_shade' },
                { label: 'Full sun', value: 'full_sun' },
              ],
              setSunlight,
            )}
            {renderBooleanFilter('Indoor', filters.indoor, setIndoor)}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button
                label="Clear"
                variant="secondary"
                onPress={() => {
                  clearFilters();
                  setSearchInput('');
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label="Apply"
                onPress={() => {
                  setIsFilterOpen(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {},
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
});
