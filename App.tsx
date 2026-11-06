import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { theme } from './src/constants/theme';
import { useGiftStore } from './src/hooks/useGiftStore';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { ReceivedScreen } from './src/screens/ReceivedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'calendar'
  | 'received'
  | 'settings';

/** State machine only — no gameplay, no navigation library. */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [personId, setPersonId] = useState<string | null>(null);

  const store = useGiftStore();
  const { state, recap } = store;

  const person =
    state.people.find(p => p.id === personId) ??
    (state.people.length > 0 ? state.people[0] : null);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goCalendar = useCallback(() => setScreen('calendar'), []);
  const goReceived = useCallback(() => setScreen('received'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);
  const goRecap = useCallback(() => setScreen('gameover'), []);

  const openPerson = useCallback((id: string) => {
    setPersonId(id);
    setScreen('game');
  }, []);

  const startPlanning = useCallback(() => {
    setScreen('game');
  }, []);

  // With an empty ledger there is no person page to show — fall back to the hub.
  const active: Screen = screen === 'game' && person === null ? 'menu' : screen;

  const barStyle = screen === 'loader' ? 'light-content' : 'dark-content';
  const barColor = screen === 'loader' ? '#5E0B2C' : 'transparent';

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor={barColor}
        barStyle={barStyle}
      />

      {active === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {active === 'menu' ? (
        <MenuScreen
          state={state}
          onStartPlanning={startPlanning}
          onOpenPerson={openPerson}
          onOpenCalendar={goCalendar}
          onOpenSettings={goSettings}
          onOpenReceived={goReceived}
        />
      ) : null}

      {active === 'game' && person !== null ? (
        <GameScreen
          person={person}
          state={state}
          onBack={goMenu}
          onGameOver={goRecap}
          onAddIdea={store.createIdea}
          onTieTheBow={store.tieTheBow}
          onLogReceived={store.createReceived}
          onToggleThanks={store.flipThanks}
        />
      ) : null}

      {active === 'gameover' ? (
        <GameOverScreen recap={recap} onPlanAgain={startPlanning} onBackToPeople={goMenu} />
      ) : null}

      {active === 'calendar' ? (
        <CalendarScreen state={state} onBack={goMenu} onOpenPerson={openPerson} />
      ) : null}

      {active === 'received' ? (
        <ReceivedScreen state={state} onBack={goMenu} onToggleThanks={store.flipThanks} />
      ) : null}

      {active === 'settings' ? <SettingsScreen state={state} onBack={goMenu} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});
