import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, TouchableOpacity,ActivityIndicator, ListView, ScrollView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import SQLite from 'react-native-sqlite-storage';

var db = SQLite.openDatabase({name: 'database.db', createFromLocation: '~www/database.db'});



export default class Drawer extends Component {
  constructor() {
    super();
    this.state = {
        isLoading: true,
        clonedResults: [],
        refreshing: false,
        tests: []
    };
}
componentDidMount() {
this.downloadDataFromDatabase(db);
}

downloadDataFromDatabase = (db) => {
  db.transaction((tx) => {
      tx.executeSql('SELECT * FROM main.descriptionTest;', [], (tx, results) => {
          var tests = [];
          for(let i = 0; i < results.rows.length; i++) {
              tests[i] = results.rows.item(i);
          }
          this.setState({ tests: tests });
      });
  });
};



  newScreen = (screen) => {
    Navigation.mergeOptions('drawerId', {
      sideMenu: {
        left: {
          visible: false
        }
      }
    })
    Navigation.push('MAIN_STACK',{
      component: {
        name: screen
      }
    })
  }

  newScreen2 = (screen, id, name) => {
    Navigation.mergeOptions('drawerId', {
        sideMenu: {
            left: {
                visible: false
            }
        }
    });
    Navigation.push('MAIN_STACK',{
        component: {
            name: screen,
            passProps: {
                id: id,
                nameTestProps: name,
            },
        }
    })
};

  render() {

    let rows = [];
    for (let i = 0; i < this.state.tests.length; i++) {
        rows.push(
            <View key={i} style={styles.view}>
        <TouchableOpacity style={styles.button} key={i} onPress={() => this.newScreen2('Tests', this.state.tests[i].id, this.state.tests[i].name)}>
          <Text style={styles.txtBig}>{this.state.tests[i].name}</Text>
        </TouchableOpacity>
            </View>
        )
    }


    return (
      <View style={styles.container}>
        <Text style={styles.quiz}>Quiz App</Text>
        <Image
          style={styles.obrazek}
          source={{uri: 'http://pluto.uploadfile.pl/pobierz/1570529---ospk/5316677400_1326980696.jpg'}}
        />
        <TouchableOpacity style={styles.button} onPress={()=> this.newScreen('App')}>
          <Text style={styles.hpTxt}>Home Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=> this.newScreen('Results')}>
          <Text style={styles.hpTxt}>Results</Text>
        </TouchableOpacity>
        <View style={{marginTop: 10, borderBottomColor: 'black', borderBottomWidth: 3,}}/>
        
        <View>
                    {rows}

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#60A510',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  quiz: {
    fontSize: 30,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center'
  },
  obrazek: {
    width: 100, 
    height: 100, 
    justifyContent: 'center',
    marginLeft: 100
  },
  button: {
    marginLeft: 28,
    height: 53, 
    width: 240,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderWidth: 2,
    borderRadius: 5
  },
  buttonBig: {
    marginLeft: 28,
    height: 63, 
    width: 240,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderRadius: 5
  },
  txtBig: {
    textAlign: 'center',
    alignItems: 'center'
  },
  hpTxt: {
    marginTop: 10
  }
});
