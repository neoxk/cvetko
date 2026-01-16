import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import type { GardenEntry, GardenFormValues } from '@domain/garden/types';
import { validateGardenForm } from '@domain/garden/validation';
import { Routes, type RootStackParamList } from '@navigation/routes';
import { Button } from '@ui/components/Button';
import { Input } from '@ui/components/Input';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useGarden } from '@ui/hooks/useGarden';
import { useTheme } from '@ui/theme';
import { formatDateOnly, getTodayUtc, parseDateOnly } from '@utils/dates';

type GardenPlantFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.GardenForm
>;

const createEmptyForm = (plantedAt: string): GardenFormValues => ({
  name: '',
  scientificName: '',
  location: '',
  plantedAt,
  notes: '',
});

export const GardenPlantFormScreen = ({
  route,
  navigation,
}: GardenPlantFormScreenProps): React.ReactElement => {
  const theme = useTheme();
  const garden = useGarden();
  const existing = route.params?.id ? garden.getById(route.params.id) : null;
  const plantSeed = route.params?.plant;
  const defaultPlantedAt = formatDateOnly(getTodayUtc());
  const [values, setValues] = React.useState<GardenFormValues>(() => {
    if (!existing) {
      return {
        ...createEmptyForm(defaultPlantedAt),
        name: plantSeed?.name ?? '',
        scientificName: plantSeed?.scientificName ?? '',
      };
    }
    return {
      name: existing.name,
      scientificName: existing.scientificName,
      location: existing.location ?? '',
      plantedAt: existing.plantedAt,
      notes: existing.notes ?? '',
    };
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof GardenFormValues, string>>>({});
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const updateField = React.useCallback(
    (field: keyof GardenFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = React.useCallback(() => {
    const validation = validateGardenForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    const resolvedScientificName =
      values.scientificName.trim() || (existing?.scientificName ?? values.name.trim());
    const entry: GardenEntry = existing
      ? {
          ...existing,
          name: values.name.trim(),
          scientificName: resolvedScientificName,
          location: values.location.trim() ? values.location.trim() : null,
          plantedAt: values.plantedAt.trim(),
          notes: values.notes.trim() ? values.notes.trim() : null,
        }
      : {
          id: `garden-${Date.now()}`,
          plantId: plantSeed?.id ?? `custom-${Date.now()}`,
          name: values.name.trim(),
          scientificName: resolvedScientificName,
          imageUrl: plantSeed?.imageUrl ?? null,
          location: values.location.trim() ? values.location.trim() : null,
          plantedAt: values.plantedAt.trim(),
          watering: plantSeed?.watering ?? null,
          sunlight: plantSeed?.sunlight ?? null,
          cycle: plantSeed?.cycle ?? null,
          hardinessMin: plantSeed?.hardinessMin ?? null,
          hardinessMax: plantSeed?.hardinessMax ?? null,
          description: plantSeed?.description ?? null,
          lastWateredAt: null,
          notes: values.notes.trim() ? values.notes.trim() : null,
        };

    if (existing) {
      garden.updateEntry(entry);
      navigation.goBack();
      return;
    }

    garden.addEntry(entry);
    navigation.navigate(Routes.RootTabs, { screen: Routes.Garden });
  }, [existing, garden, navigation, values]);

  return (
    <ScreenLayout title={existing ? 'Edit plant' : 'Add plant'}>
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Input
            label="Plant name"
            value={values.name}
            onChangeText={(value) => updateField('name', value)}
            {...(errors.name ? { errorText: errors.name } : {})}
          />
        </View>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Input
            label="Location"
            value={values.location}
            onChangeText={(value) => updateField('location', value)}
            helperText="Optional (e.g., Balcony, Living room)"
          />
        </View>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Input
            label="Planting date"
            value={values.plantedAt}
            onChangeText={(value) => updateField('plantedAt', value)}
            helperText="Use YYYY-MM-DD or pick a date below."
            {...(errors.plantedAt ? { errorText: errors.plantedAt } : {})}
          />
          <View style={{ marginTop: theme.spacing.sm, alignSelf: 'flex-start' }}>
            <Button
              label="Change date"
              variant="secondary"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
          {showDatePicker ? (
            <View style={{ marginTop: theme.spacing.sm }}>
              <DateTimePicker
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                value={parseDateOnly(values.plantedAt) ?? getTodayUtc()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS !== 'ios') {
                    setShowDatePicker(false);
                  }
                  if (event.type === 'set' && selectedDate) {
                    updateField('plantedAt', formatDateOnly(selectedDate));
                  }
                }}
              />
            </View>
          ) : null}
        </View>
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Input
            label="Notes"
            value={values.notes}
            onChangeText={(value) => updateField('notes', value)}
            helperText="Optional care notes"
          />
        </View>
        <Button label={existing ? 'Save changes' : 'Plant'} onPress={handleSubmit} />
        {garden.error ? (
          <Text
            style={{
              marginTop: theme.spacing.sm,
              color: theme.colors.alert,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
            }}
          >
            {garden.error.message}
          </Text>
        ) : null}
      </ScrollView>
    </ScreenLayout>
  );
};
