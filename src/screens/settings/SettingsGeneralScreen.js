import React from 'react';
import { ScrollView } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import SwitchSetting from '../../components/Switch/Switch';
import DisplayModeModal from '../more/components/DisplayModeModal';
import GridSizeModal from '../more/components/GridSizeModal';

import { useSettings } from '../../hooks/reduxHooks';
import { useTheme } from '@hooks/useTheme';
import { setAppSettings } from '../../redux/settings/settings.actions';
import { SHOW_LAST_UPDATE_TIME } from '../../redux/updates/updates.types';
import DefaultChapterSortModal from './components/DefaultChapterSortModal';
import {
  DisplayModes,
  displayModesList,
} from '@screens/library/constants/constants';
import { useLibrarySettings } from '@hooks/useSettings';
import useBoolean from '@hooks/useBoolean';
import { Appbar, List } from '@components';

const GenralSettings = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { displayMode = DisplayModes.Comfortable, novelsPerRow = 3 } =
    useLibrarySettings();

  const {
    updateLibraryOnLaunch = false,
    downloadNewChapters = false,
    onlyUpdateOngoingNovels = false,
    defaultChapterSort = 'ORDER BY chapterId ASC',
    refreshNovelMetadata = false,
    disableHapticFeedback = false,
    useLibraryFAB = false,
  } = useSettings();

  const { showLastUpdateTime = true } = useSelector(
    state => state.updatesReducer,
  );

  /**
   * Display Mode Modal
   */
  const displayModalRef = useBoolean();

  /**
   * Grid Size Modal
   */
  const gridSizeModalRef = useBoolean();

  const defaultChapterSortModal = useBoolean();

  return (
    <>
      <Appbar title="General" handleGoBack={navigation.goBack} theme={theme} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <List.Section>
          <List.SubHeader theme={theme}>Display</List.SubHeader>
          <List.Item
            title="Display Mode"
            description={displayModesList[displayMode].label}
            onPress={displayModalRef.setTrue}
            theme={theme}
          />
          <List.Item
            title="Items per row in library"
            description={`${novelsPerRow} items per row`}
            onPress={gridSizeModalRef.setTrue}
            theme={theme}
          />
          <List.Divider theme={theme} />
          <List.SubHeader theme={theme}>Library</List.SubHeader>
          <SwitchSetting
            label="Update library on launch"
            value={updateLibraryOnLaunch}
            onPress={() =>
              dispatch(
                setAppSettings('updateLibraryOnLaunch', !updateLibraryOnLaunch),
              )
            }
            theme={theme}
          />
          <SwitchSetting
            label="Use FAB in Library"
            value={useLibraryFAB}
            onPress={() =>
              dispatch(setAppSettings('useLibraryFAB', !useLibraryFAB))
            }
            theme={theme}
          />
          <List.Divider theme={theme} />
          <List.SubHeader theme={theme}>Novel</List.SubHeader>
          <List.Item
            title="Default chapter sort"
            description={`By source ${
              defaultChapterSort === 'ORDER BY chapterId ASC'
                ? '(Ascending)'
                : '(Descending)'
            }`}
            onPress={defaultChapterSortModal.setTrue}
            theme={theme}
          />
          <List.Divider theme={theme} />
          <List.SubHeader theme={theme}>Global update</List.SubHeader>
          <SwitchSetting
            label="Only update ongoing novels"
            value={onlyUpdateOngoingNovels}
            onPress={() =>
              dispatch(
                setAppSettings(
                  'onlyUpdateOngoingNovels',
                  !onlyUpdateOngoingNovels,
                ),
              )
            }
            theme={theme}
          />
          <SwitchSetting
            label="Automatically refresh metadata"
            description="Check for new cover and details when updating library"
            value={refreshNovelMetadata}
            onPress={() =>
              dispatch(
                setAppSettings('refreshNovelMetadata', !refreshNovelMetadata),
              )
            }
            theme={theme}
          />
          <SwitchSetting
            label="Show last update time"
            value={showLastUpdateTime}
            onPress={() =>
              dispatch({
                type: SHOW_LAST_UPDATE_TIME,
                payload: !showLastUpdateTime,
              })
            }
            theme={theme}
          />
          <List.Divider theme={theme} />
          <List.SubHeader theme={theme}>Auto-download</List.SubHeader>
          <SwitchSetting
            label="Download new chapters"
            value={downloadNewChapters}
            onPress={() =>
              dispatch(
                setAppSettings('downloadNewChapters', !downloadNewChapters),
              )
            }
            theme={theme}
          />
          <List.Divider theme={theme} />
          <List.SubHeader theme={theme}>General</List.SubHeader>
          <SwitchSetting
            label="Disable haptic feedback"
            value={disableHapticFeedback}
            onPress={() =>
              dispatch(
                setAppSettings('disableHapticFeedback', !disableHapticFeedback),
              )
            }
            theme={theme}
          />
        </List.Section>
      </ScrollView>
      <DisplayModeModal
        displayMode={displayMode}
        displayModalVisible={displayModalRef.value}
        hideDisplayModal={displayModalRef.setFalse}
        theme={theme}
      />
      <DefaultChapterSortModal
        defaultChapterSort={defaultChapterSort}
        displayModalVisible={defaultChapterSortModal.value}
        hideDisplayModal={defaultChapterSortModal.setFalse}
        dispatch={dispatch}
        theme={theme}
      />
      <GridSizeModal
        novelsPerRow={novelsPerRow}
        gridSizeModalVisible={gridSizeModalRef.value}
        hideGridSizeModal={gridSizeModalRef.setFalse}
        theme={theme}
      />
    </>
  );
};

export default GenralSettings;
