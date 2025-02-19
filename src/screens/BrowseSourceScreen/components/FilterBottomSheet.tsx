import React, { Ref, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import color from 'color';

import BottomSheet from '../../../components/BottomSheet/BottomSheet';
import BottomSheetType, { BottomSheetView } from '@gorhom/bottom-sheet';

import { useTheme } from '@hooks/useTheme';
import {
  FilterInputs,
  SelectedFilter,
  SourceFilter,
} from '../../../sources/types/filterTypes';
import { FlatList } from 'react-native-gesture-handler';
import { Button, IconButtonV2 } from '@components/index';
import { ButtonVariation } from '@components/Button/Button';
import { dividerColor } from '../../../theme/colors';
import { Checkbox } from '@components/Checkbox/Checkbox';
import { defaultTo } from 'lodash';
import { Picker } from '@react-native-picker/picker';
import useBoolean from '@hooks/useBoolean';
import { overlay } from 'react-native-paper';

const insertOrRemoveIntoArray = (array: string[], val: string): string[] =>
  array.indexOf(val) > -1 ? array.filter(ele => ele !== val) : [...array, val];

interface FilterItemProps {
  filter: SourceFilter;
  selectedFilters: SelectedFilter | undefined;
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<SelectedFilter | undefined>
  >;
}

const FilterItem: React.FC<FilterItemProps> = ({
  filter,
  selectedFilters,
  setSelectedFilters,
}) => {
  const theme = useTheme();

  const { value: isVisible, toggle: toggleCard } = useBoolean();

  if (filter.inputType === FilterInputs.Picker) {
    return (
      <View style={styles.pickerContainer}>
        <Text style={[styles.pickerLabel, { color: theme.textColorSecondary }]}>
          {filter.label}
        </Text>
        <Picker
          style={styles.picker}
          mode="dropdown"
          selectedValue={selectedFilters?.[filter.key] as string}
          dropdownIconRippleColor={theme.primary}
          onValueChange={(itemValue: string) =>
            setSelectedFilters(prevFilters => ({
              ...prevFilters,
              [filter.key]: itemValue,
            }))
          }
          placeholder={filter.label}
        >
          {filter.values.map(val => {
            return <Picker.Item label={val.label} value={val.value} />;
          })}
        </Picker>
      </View>
    );
  }

  if (filter.inputType === FilterInputs.Checkbox) {
    const isChecked = (val: string) =>
      (selectedFilters?.[filter.key] as string[])?.includes(val);

    return (
      <View>
        <Pressable
          style={styles.checkboxHeader}
          onPress={toggleCard}
          android_ripple={{ color: color(theme.primary).alpha(0.12).string() }}
        >
          <Text
            style={[styles.filterLabel, { color: theme.textColorSecondary }]}
          >
            {filter.label}
          </Text>
          <IconButtonV2
            name={isVisible ? 'chevron-up' : 'chevron-down'}
            onPress={toggleCard}
            theme={theme}
          />
        </Pressable>
        {isVisible
          ? filter.values.map(val => {
              return (
                <Checkbox
                  label={val.label}
                  theme={theme}
                  status={isChecked(val.value)}
                  onPress={() =>
                    setSelectedFilters(prevFilters => ({
                      ...prevFilters,
                      [filter.key]: insertOrRemoveIntoArray(
                        defaultTo(prevFilters?.[filter.key] as string[], []),
                        val.value,
                      ),
                    }))
                  }
                />
              );
            })
          : null}
      </View>
    );
  }

  return <></>;
};

interface BottomSheetProps {
  filterSheetRef: Ref<BottomSheetType> | null;
  filtersValues: SourceFilter[] | undefined;
  setFilters: (filters?: SelectedFilter) => void;
  clearFilters: () => void;
}

const FilterBottomSheet: React.FC<BottomSheetProps> = ({
  filterSheetRef,
  filtersValues,
  clearFilters,
  setFilters,
}) => {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<
    SelectedFilter | undefined
  >();

  return (
    <BottomSheet
      bottomSheetRef={filterSheetRef}
      snapPoints={[400, 600]}
      height={600}
      theme={theme}
    >
      <BottomSheetView
        style={[
          styles.container,
          { backgroundColor: overlay(2, theme.surface) },
        ]}
      >
        <BottomSheetView
          style={[
            styles.buttonContainer,
            { borderBottomColor: dividerColor(theme.isDark) },
          ]}
        >
          <Button
            title={'Reset'}
            variation={ButtonVariation.CLEAR}
            onPress={() => {
              setSelectedFilters(undefined);
              clearFilters();
            }}
            theme={theme}
          />
          <Button
            title={'Filter'}
            textColor={theme.textColorPrimary}
            onPress={() => {
              setFilters(selectedFilters);
              filterSheetRef?.current?.collapse();
            }}
            theme={theme}
          />
        </BottomSheetView>
        <FlatList
          contentContainerStyle={styles.filterContainer}
          data={filtersValues}
          keyExtractor={item => item.key}
          renderItem={({ item }: { item: SourceFilter }) => (
            <FilterItem
              filter={item}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default FilterBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filterContainer: {
    paddingVertical: 16,
  },
  filterLabel: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  pickerLabel: {
    paddingHorizontal: 16,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    width: 200,
  },
  checkboxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
});
