import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Input } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { useTheme } from '@ui/theme';

type PlantSearchBarProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  onClear: () => void;
};

export const PlantSearchBar = ({
  query,
  onChangeQuery,
  onClear,
}: PlantSearchBarProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Input value={query} placeholder="Search plants" onChangeText={onChangeQuery} />
      </View>
      {query.length > 0 ? (
        <View style={{ marginLeft: theme.spacing.sm }}>
          <Button label="Clear" variant="tertiary" onPress={onClear} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
});
