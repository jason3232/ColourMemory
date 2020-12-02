import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Highscore = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const updateLeaderboard = async () => {
      try {
        const data = await AsyncStorage.getItem('highscores');
        if (data) {
          const savedRecords = JSON.parse(data);
          setLeaderboard(savedRecords);
        }
      } catch (e) {
        console.error('An error occured while loading the leaderboard', e);
      }
    };
    updateLeaderboard();
  }, []);

  useEffect(() => {
    console.log('Updated Leaderboard', leaderboard);
  }, [leaderboard]);

  leaderboard && leaderboard.length;

  return (
    <View style={styles.leaderboard}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardText}>Rank</Text>
        <Text style={[styles.leaderboardText, styles.leaderboardName]}>
          Name
        </Text>
        <Text style={styles.leaderboardText}>Score</Text>
      </View>
      {leaderboard && leaderboard.length ? (
        leaderboard.map((highscore, i) => (
          <View key={i} style={styles.leaderboardEntry}>
            <Text style={styles.leaderboardText}>{i + 1}</Text>
            <Text style={[styles.leaderboardText, styles.leaderboardName]}>
              {highscore.name}
            </Text>
            <Text style={styles.leaderboardText}>{highscore.score}</Text>
          </View>
        ))
      ) : (
        <View style={styles.leaderboardEntry}>
          <Text style={styles.leaderboardText}>There are no records yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  leaderboard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#bbb',
  },
  leaderboardHeader: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardEntry: {
    flex: 1,
    maxHeight: '10%',
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  leaderboardName: {
    flex: 2,
  },
});

export default Highscore;
