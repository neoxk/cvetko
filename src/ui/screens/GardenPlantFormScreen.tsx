import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { GardenEntry, GardenFormValues } from '@domain/garden/types';
import { validateGardenForm } from '@domain/garden/validation';
import { Routes, type RootStackParamList } from '@navigation/routes';
import { Button } from '@ui/components/Button';
import { Input } from '@ui/components/Input';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useGarden } from '@ui/hooks/useGarden';
import { useTheme } from '@ui/theme';

type GardenPlantFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.GardenForm
>;

const emptyForm: GardenFormValues = {
  name: '',
  scientificName: '',
  location: '',
  plantedAt: '',
  notes: '',
};

export const GardenPlantFormScreen = ({
  route,
  navigation,
}: GardenPlantFormScreenProps): React.ReactElement => {
  const theme = useTheme();
  const garden = useGarden();
  const existing = route.params?.id ? garden.getById(route.params.id) : null;
  const [values, setValues] = React.useState<GardenFormValues>(() => {
    if (!existing) {
      return emptyForm;
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

    const entry: GardenEntry = existing
      ? {
          ...existing,
          name: values.name.trim(),
          scientificName: values.scientificName.trim(),
          location: values.location.trim() ? values.location.trim() : null,
          plantedAt: values.plantedAt.trim(),
          notes: values.notes.trim() ? values.notes.trim() : null,
        }
      : {
          id: `garden-${Date.now()}`,
          plantId: `custom-${Date.now()}`,
          source: 'perenual',
          name: values.name.trim(),
          scientificName: values.scientificName.trim(),
          imageUrl: null,
          location: values.location.trim() ? values.location.trim() : null,
          plantedAt: values.plantedAt.trim(),
          lastWateredAt: null,
          lastFertilizedAt: null,
          notes: values.notes.trim() ? values.notes.trim() : null,
        };

    if (existing) {
      garden.updateEntry(entry);
    } else {
      garden.addEntry(entry);
    }

    navigation.goBack();
  }, [existing, garden, navigation, values]);

  return (
    <ScreenLayout title={existing ? 'Edit plant' : 'Add plant'} footerText="Cvetko">
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
            label="Scientific name"
            value={values.scientificName}
            onChangeText={(value) => updateField('scientificName', value)}
            {...(errors.scientificName ? { errorText: errors.scientificName } : {})}
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
            helperText="YYYY-MM-DD"
            {...(errors.plantedAt ? { errorText: errors.plantedAt } : {})}
          />
        </View>
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Input
            label="Notes"
            value={values.notes}
            onChangeText={(value) => updateField('notes', value)}
            helperText="Optional care notes"
          />
        </View>
        <Button label={existing ? 'Save changes' : 'Add plant'} onPress={handleSubmit} />
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
