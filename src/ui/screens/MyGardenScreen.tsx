import React from 'react';
import { FlatList, View, type ListRenderItemInfo } from 'react-native';

import type { GardenEntry } from '@domain/garden/types';
import { getGardenStatus } from '@domain/garden/status';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { PlantListItemCard } from '@ui/components/PlantListItemCard';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useGarden } from '@ui/hooks/useGarden';
import { Routes } from '@navigation/routes';
import { useRootNavigation } from '@navigation/navigationHelpers';
import { Button } from '@ui/components/Button';
import { useTheme } from '@ui/theme';

type GardenFilter = 'all' | 'needsWater' | 'needsFertilizer';

export const MyGardenScreen = (): React.ReactElement => {
  const theme = useTheme();
  const navigation = useRootNavigation();
  const garden = useGarden();
  const [filter, setFilter] = React.useState<GardenFilter>('all');

  const filteredEntries = React.useMemo(() => {
    if (filter === 'all') {
      return garden.entries;
    }
    return garden.entries.filter((entry) => getGardenStatus(entry) === filter);
  }, [filter, garden.entries]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<GardenEntry>) => {
      const status = getGardenStatus(item);
      const statusLabel =
        status === 'needsWater'
          ? 'Needs water'
          : status === 'needsFertilizer'
            ? 'Needs fertilizer'
            : 'Healthy';
      const statusTone =
        status === 'needsWater' ? 'warning' : status === 'needsFertilizer' ? 'alert' : 'neutral';

      return (
        <PlantListItemCard
          title={item.name}
          subtitle={item.scientificName}
          imageUrl={item.imageUrl}
          statusLabel={statusLabel}
          statusTone={statusTone}
        onPress={() =>
          navigation.navigate({
            name: Routes.GardenForm,
            params: { id: item.id },
          })
        }
          actionLabel="Remove"
          onAction={() => garden.removeEntry(item.id)}
        />
      );
    },
    [garden, navigation],
  );

  let content = null;
  if (garden.isLoading) {
    content = <LoadingState message="Loading your garden..." />;
  } else if (garden.error) {
    content = (
      <ErrorState
        title="Garden unavailable"
        message={garden.error.message}
        actionLabel="Retry"
        onAction={garden.refresh}
      />
    );
  } else if (filteredEntries.length === 0) {
    content = (
      <EmptyState
        title="Your garden is empty"
        message="Add your first plant to start tracking care."
        actionLabel="Add plant"
        onAction={() => navigation.navigate({ name: Routes.GardenForm, params: {} })}
      />
    );
  } else {
    content = (
      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
      />
    );
  }

  return (
    <ScreenLayout title="My garden" footerText="Cvetko">
      <View style={{ marginBottom: theme.spacing.md }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: theme.spacing.sm }}>
            <Button
              label="All"
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onPress={() => setFilter('all')}
            />
          </View>
          <View style={{ marginRight: theme.spacing.sm }}>
            <Button
              label="Needs water"
              variant={filter === 'needsWater' ? 'primary' : 'secondary'}
              onPress={() => setFilter('needsWater')}
            />
          </View>
          <Button
            label="Needs fertilizer"
            variant={filter === 'needsFertilizer' ? 'primary' : 'secondary'}
            onPress={() => setFilter('needsFertilizer')}
          />
        </View>
      </View>
      {content}
    </ScreenLayout>
  );
};
