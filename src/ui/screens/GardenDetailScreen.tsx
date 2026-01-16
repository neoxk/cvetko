import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import type { GardenEntry } from '@domain/garden/types';
import { getGardenStatus } from '@domain/garden/status';
import { resolveWaterEveryDays } from '@domain/garden/care';
import { formatDateOnly } from '@utils/dates';
import { Routes, type RootStackParamList } from '@navigation/routes';
import { Button } from '@ui/components/Button';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { Input } from '@ui/components/Input';
import { LoadingState } from '@ui/components/LoadingState';
import { PlantDetailRow } from '@ui/components/PlantDetailRow';
import { PlantDetailSection } from '@ui/components/PlantDetailSection';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useCareEvents } from '@ui/hooks/useCareEvents';
import { useGarden } from '@ui/hooks/useGarden';
import { useTheme } from '@ui/theme';

type GardenDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.GardenDetail
>;

type GardenTab = 'home' | 'edit';

const formatDateLabel = (value?: string | null): string => {
  if (!value) {
    return 'Not yet';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return formatDateOnly(date);
};

export const GardenDetailScreen = ({
  route,
  navigation,
}: GardenDetailScreenProps): React.ReactElement => {
  const theme = useTheme();
  const garden = useGarden();
  const careEvents = useCareEvents();
  const [tab, setTab] = React.useState<GardenTab>('home');
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const entry = garden.getById(route.params.id);

  useFocusEffect(
    React.useCallback(() => {
      garden.refresh();
      careEvents.refresh();
    }, [garden.refresh, careEvents.refresh]),
  );

  React.useEffect(() => {
    if (!entry) {
      return;
    }
    setName(entry.name);
    setLocation(entry.location ?? '');
    setError(null);
  }, [entry]);

  const lastWateredAt = React.useMemo(() => {
    if (!entry) {
      return null;
    }
    const latestEvent = careEvents.getLatestWaterEvent(entry.id);
    return latestEvent?.occurredAt ?? entry.lastWateredAt ?? entry.plantedAt ?? null;
  }, [careEvents, entry]);

  const needsWater = React.useMemo(() => {
    if (!entry) {
      return false;
    }
    return (
      getGardenStatus(entry, Date.now(), {
        lastWateredAt,
        waterEveryDays: resolveWaterEveryDays(entry.watering),
      }) === 'needsWater'
    );
  }, [entry, lastWateredAt]);

  const handleSave = React.useCallback(() => {
    if (!entry) {
      return;
    }
    if (!name.trim()) {
      setError('Plant name is required.');
      return;
    }
    garden.updateEntry({
      ...entry,
      name: name.trim(),
      location: location.trim() ? location.trim() : null,
    });
    setTab('home');
  }, [entry, garden, location, name]);

  let content = null;
  if (garden.isLoading || careEvents.isLoading) {
    content = <LoadingState message="Loading plant..." />;
  } else if (garden.error || careEvents.error) {
    content = (
      <ErrorState
        title="Plant unavailable"
        message={(garden.error ?? careEvents.error)?.message ?? 'Something went wrong.'}
        actionLabel="Retry"
        onAction={() => {
          garden.refresh();
          careEvents.refresh();
        }}
      />
    );
  } else if (!entry) {
    content = (
      <EmptyState
        title="Plant not found"
        message="This plant is no longer in your garden."
        actionLabel="Back"
        onAction={() => navigation.goBack()}
      />
    );
  } else if (tab === 'edit') {
    content = (
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Input label="Plant name" value={name} onChangeText={setName} />
        </View>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            helperText="Optional (e.g., Balcony, Living room)"
          />
        </View>
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Input
            label="Planting date"
            value={formatDateLabel(entry.plantedAt)}
            onChangeText={() => {}}
            editable={false}
            helperText="Locked"
          />
        </View>
        <Button label="Save changes" onPress={handleSave} />
        {error ? (
          <Text
            style={{
              marginTop: theme.spacing.sm,
              color: theme.colors.alert,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
            }}
          >
            {error}
          </Text>
        ) : null}
      </ScrollView>
    );
  } else {
    const sectionSpacing = { marginBottom: theme.spacing.lg };
    const waterEveryDays = resolveWaterEveryDays(entry.watering);
    const waterFrequency =
      waterEveryDays === 0 ? 'No watering required' : `Every ${waterEveryDays} days`;

    content = (
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <View style={sectionSpacing}>
          <PlantDetailSection title="Overview">
            <PlantDetailRow label="Name" value={entry.name} />
            <PlantDetailRow label="Scientific name" value={entry.scientificName} />
            {entry.location ? <PlantDetailRow label="Location" value={entry.location} /> : null}
            <PlantDetailRow label="Planting date" value={formatDateLabel(entry.plantedAt)} />
          </PlantDetailSection>
        </View>
        <View style={sectionSpacing}>
          <PlantDetailSection title="Care">
            <PlantDetailRow label="Last watered" value={formatDateLabel(lastWateredAt)} />
            <PlantDetailRow label="Watering" value={waterFrequency} />
            {needsWater ? (
              <Text
                style={{
                  marginTop: theme.spacing.sm,
                  color: theme.colors.warning,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.sizes.bodyM,
                }}
              >
                Needs watering soon.
              </Text>
            ) : null}
          </PlantDetailSection>
        </View>
        <View style={{ gap: theme.spacing.md }}>
          <Button label="Watered" onPress={() => careEvents.addWaterEvent(entry.id, entry.plantId)} />
          <Button label="Edit" variant="secondary" onPress={() => setTab('edit')} />
          <Button
            label="Remove plant"
            variant="tertiary"
            onPress={() => {
              garden.removeEntry(entry.id);
              navigation.goBack();
            }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScreenLayout title={entry?.name ?? 'My plant'} onBack={() => navigation.goBack()}>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
        <View style={{ marginRight: theme.spacing.sm }}>
          <Button
            label="Home"
            variant={tab === 'home' ? 'primary' : 'secondary'}
            onPress={() => setTab('home')}
          />
        </View>
        <Button
          label="Edit"
          variant={tab === 'edit' ? 'primary' : 'secondary'}
          onPress={() => setTab('edit')}
        />
      </View>
      {content}
    </ScreenLayout>
  );
};
