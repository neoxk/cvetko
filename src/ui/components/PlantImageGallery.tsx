import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';

import type { PlantDetailImage } from '@domain/plants/detailTypes';
import { useTheme } from '@ui/theme';

type PlantImageGalleryProps = {
  images: PlantDetailImage[];
};

export const PlantImageGallery = ({
  images,
}: PlantImageGalleryProps): React.ReactElement => {
  const theme = useTheme();

  if (images.length === 0) {
    return (
      <View
        style={[
          styles.placeholder,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: theme.borders.thin,
            borderRadius: theme.radius.image,
            height: theme.sizing.listItemImage * 2,
          },
        ]}
      />
    );
  }

  return (
    <FlatList
      data={images}
      horizontal
      keyExtractor={(item) => item.url}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: theme.spacing.md }}
      ItemSeparatorComponent={() => <View style={{ width: theme.spacing.md }} />}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.url }}
          accessibilityLabel={item.alt}
          style={[
            styles.image,
            {
              borderRadius: theme.radius.image,
              height: theme.sizing.listItemImage * 2,
              width: theme.sizing.listItemImage * 2,
            },
          ]}
          resizeMode="cover"
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'transparent',
  },
  placeholder: {
    width: '100%',
  },
});
