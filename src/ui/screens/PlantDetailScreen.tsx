import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { createDefaultPlantRepositories } from '@data/plants/factory';
import type { PlantDetailRepository } from '@data/plants/detailRepository';
import { Routes, type RootStackParamList } from '@navigation/routes';
import type { PlantActionHandlers } from '@ui/hooks/usePlantActions';
import { usePlantActions } from '@ui/hooks/usePlantActions';
import { usePlantDetail } from '@ui/hooks/usePlantDetail';
import { useWishlist } from '@ui/hooks/useWishlist';
import { useGarden } from '@ui/hooks/useGarden';
import { Button } from '@ui/components/Button';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { PlantDetailRow } from '@ui/components/PlantDetailRow';
import { PlantDetailSection } from '@ui/components/PlantDetailSection';
import { PlantImageGallery } from '@ui/components/PlantImageGallery';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useTheme } from '@ui/theme';
import { wishlistItemFromDetail } from '@utils/wishlist';

const findDetailValue = (
  items: { label: string; value: string }[],
  label: string,
): string | null => items.find((item) => item.label === label)?.value ?? null;

const parseHardinessRange = (value: string | null): { min: number | null; max: number | null } => {
  if (!value) {
    return { min: null, max: null };
  }
  const parts = value.split('-').map((part) => part.trim());
  if (parts.length !== 2) {
    return { min: null, max: null };
  }
  const min = Number(parts[0]);
  const max = Number(parts[1]);
  return {
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
  };
};

type PlantDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.PlantDetail
> & {
  repository?: PlantDetailRepository;
  actionHandlers?: PlantActionHandlers;
};

export const PlantDetailScreen = ({
  route,
  navigation,
  repository,
  actionHandlers,
}: PlantDetailScreenProps): React.ReactElement => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { id } = route.params;
  const resolvedRepository = React.useMemo(() => {
    if (repository) {
      return repository;
    }
    return createDefaultPlantRepositories()?.detailRepository ?? null;
  }, [repository]);
  const { detail, isLoading, error, refresh } = usePlantDetail({
    repository: resolvedRepository,
    id,
  });
  const wishlist = useWishlist();
  const garden = useGarden();
  useFocusEffect(
    React.useCallback(() => {
      garden.refresh();
    }, [garden.refresh]),
  );
  const resolvedHandlers: PlantActionHandlers = {};
  if (detail) {
    resolvedHandlers.addToWishlist = () => Promise.resolve(wishlist.toggle(wishlistItemFromDetail(detail)));
  }
  if (actionHandlers?.addToGarden) {
    resolvedHandlers.addToGarden = actionHandlers.addToGarden;
  }

  const actions = usePlantActions(detail, resolvedHandlers, {
    initialInWishlist: detail ? wishlist.isInWishlist(detail.id) : false,
  });
  const isInGarden = detail ? garden.hasPlant(detail.id) : false;

  const title = detail?.commonName ?? detail?.scientificName ?? 'Plant details';

  let content = null;
  if (isLoading) {
    content = <LoadingState message="Loading plant details..." />;
  } else if (error) {
    content = (
      <ErrorState
        title="Could not load details"
        message={error.message}
        actionLabel="Retry"
        onAction={refresh}
      />
    );
  } else if (!detail) {
    content = (
      <EmptyState
        title="Details unavailable"
        message="We couldn't load this plant right now."
        actionLabel="Retry"
        onAction={refresh}
      />
    );
  } else {
    const sectionSpacing = { marginBottom: theme.spacing.lg };
    const renderSection = (title: string, items: { label: string; value: string }[]) => {
      if (items.length === 0) {
        return null;
      }
      return (
        <View style={sectionSpacing}>
          <PlantDetailSection title={title}>
            {items.map((item) => (
              <PlantDetailRow key={`${title}-${item.label}`} label={item.label} value={item.value} />
            ))}
          </PlantDetailSection>
        </View>
      );
    };
    const hasOverview = detail.overview.length > 0 || Boolean(detail.description);

    const overviewBlock = hasOverview ? (
      <View style={sectionSpacing}>
        <PlantDetailSection title="Overview">
          {detail.overview.map((item) => (
            <PlantDetailRow key={`overview-${item.label}`} label={item.label} value={item.value} />
          ))}
          {detail.description ? (
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.sizes.bodyM,
                marginTop: detail.overview.length > 0 ? theme.spacing.sm : 0,
              }}
            >
              {detail.description}
            </Text>
          ) : null}
        </PlantDetailSection>
      </View>
    ) : null;

    const pestsBlock =
      detail.pests.length > 0 ? (
        <View style={sectionSpacing}>
          <PlantDetailSection title="Pests">
            {detail.pests.map((pest) => (
              <Text
                key={pest}
                style={{
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.sizes.bodyM,
                }}
              >
                {pest}
              </Text>
            ))}
          </PlantDetailSection>
        </View>
      ) : null;

    const actionsBlock = (
      <View>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Button
            label={actions.isInWishlist ? 'Added to wishlist' : 'Add to wishlist'}
            onPress={actions.addToWishlist}
            disabled={actions.isInWishlist || actions.isUpdatingWishlist}
            variant="secondary"
          />
        </View>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Button
            label={isInGarden ? 'Added to my garden' : 'Add to my garden'}
            onPress={() => {
              if (!detail || isInGarden) {
                return;
              }
              const watering = findDetailValue(detail.care, 'Watering');
              const sunlight = findDetailValue(detail.care, 'Sunlight');
              const cycle = findDetailValue(detail.growth, 'Life cycle');
              const hardinessValue = findDetailValue(detail.growth, 'Hardiness');
              const hardiness = parseHardinessRange(hardinessValue);
              navigation.navigate(Routes.GardenForm, {
                plant: {
                  id: detail.id,
                  name: detail.commonName ?? detail.scientificName,
                  scientificName: detail.scientificName,
                  imageUrl: detail.images[0]?.url ?? null,
                  watering,
                  sunlight,
                  cycle,
                  hardinessMin: hardiness.min,
                  hardinessMax: hardiness.max,
                  description: detail.description,
                },
              });
            }}
            disabled={isInGarden}
            variant="secondary"
          />
        </View>
        {actions.error ? (
          <Text
            style={{
              color: theme.colors.alert,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
            }}
          >
            {actions.error.message}
          </Text>
        ) : null}
      </View>
    );

    content = (
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xl }]}>
        <View style={sectionSpacing}>
          <PlantImageGallery images={detail.images} />
        </View>
        {isLandscape ? (
          <View style={{ flexDirection: 'row', gap: theme.spacing.lg }}>
            <View style={{ flex: 1 }}>
              {overviewBlock}
              {renderSection('Care', detail.care)}
              {renderSection('Growth', detail.growth)}
            </View>
            <View style={{ flex: 1 }}>
              {renderSection('Seasonal & reproduction', detail.seasonal)}
              {renderSection('Safety & use', detail.safety)}
              {renderSection('Tolerance', detail.tolerance)}
              {renderSection('Ecology', detail.ecology)}
              {renderSection('Anatomy', detail.anatomy)}
              {pestsBlock}
              {actionsBlock}
            </View>
          </View>
        ) : (
          <View>
            {overviewBlock}
            {renderSection('Care', detail.care)}
            {renderSection('Growth', detail.growth)}
            {renderSection('Seasonal & reproduction', detail.seasonal)}
            {renderSection('Safety & use', detail.safety)}
            {renderSection('Tolerance', detail.tolerance)}
            {renderSection('Ecology', detail.ecology)}
            {renderSection('Anatomy', detail.anatomy)}
            {pestsBlock}
            {actionsBlock}
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <ScreenLayout title={title}>
      <View style={styles.container}>{content}</View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
});
