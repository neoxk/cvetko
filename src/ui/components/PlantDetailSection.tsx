import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Card } from '@ui/components/Card';
import { useTheme } from '@ui/theme';

type PlantDetailSectionProps = {
  title: string;
  children: ReactNode;
};

export const PlantDetailSection = ({
  title,
  children,
}: PlantDetailSectionProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ marginBottom: theme.spacing.sm }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fontFamily.heading,
            fontSize: theme.typography.sizes.h3,
            fontWeight: theme.typography.weights.semiBold,
          }}
        >
          {title}
        </Text>
      </View>
      {children}
    </Card>
  );
};
