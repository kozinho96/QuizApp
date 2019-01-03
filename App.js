import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, TouchableOpacity, StatusBar, ScrollView, ListView, ActivityIndicator} from 'react-native';
import {Navigation} from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { AsyncStorage } from "react-native"
import Regulations from './screens/Regulations';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { _ } from 'lodash';
import SQLite from 'react-native-sqlite-storage';

var db = SQLite.openDatabase({name: 'database.db', createFromLocation: '~www/database.db'});

export default class App extends Component {
  constructor() {
    super();
    this.state = {
        isLoading: true,
        clonedResults: [],
        refreshing: false,
        tests: []
    };
}

async componentDidMount() {
  this._selectDataFromTable()
  SplashScreen.hide();
  try {
      const value = await AsyncStorage.getItem('databaseDownloadDate');
      if (value == null) {
          this.insertData();
      } else {
          let now = new Date();
          let then = new Date(JSON.parse(value).value);
          const utc1 = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
          const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
          if (Math.floor((utc2 - utc1) / 86400000) >= 1) {
              this.insertData();
          } else {
              this.downloadDataFromDatabase(db);
          }
      }
  } catch (error) {
  }

  this._selectDataFromTable()

}

_selectDataFromTable(){
  db.transaction((tx) => {
      tx.executeSql('SELECT * FROM main.descriptionTest',[], (tx, results) => {
          var len = results.rows.length;
          console.log("dlugosc: ", len)
          console.log(results.rows.item(0))
          console.log(results.rows.item(1))
          console.log(results.rows.item(2))
          console.log(results.rows.item(3))
          console.log(results.rows.item(4))


      });
  });
}

insertData = () => {
  db.transaction((tx) => {
      fetch("https://pwsz-quiz-api.herokuapp.com/api/tests")
          .then((response) => response.json())
          .then((responseJson) => {
              this.setState({tests: responseJson});
              this.addTestsToDatabase(db, responseJson);
              this.downloadTestData();
          });
  })
};

addTestsToDatabase = (db, data) => {
  db.transaction((tx) => {
      tx.executeSql('DELETE FROM descriptionTest; DELETE FROM test; VACUUM;', [], (tx, results) => {
      });
      for (let i = 0; i < data.length; i++) {
          tx.executeSql(
              'INSERT INTO descriptionTest (id, name, description, tags, level, numberOfTasks) VALUES (?, ?, ?, ?, ?, ?);',
              [data[i].id, data[i].name, data[i].description, JSON.stringify(data[i].tags), data[i].level, data[i].numberOfTasks]
          );
      }
  });
};

downloadTestData = () => {
  for (let i = 0; i < this.state.tests.length; i++) {
      fetch('https://pwsz-quiz-api.herokuapp.com/api/test/' + this.state.tests[i].id)
          .then((data) => data.json())
          .then((d) => {
              db.transaction((tx) => {
                  tx.executeSql(
                      'INSERT INTO tests (id, name, description, level, tasks, tags) VALUES (?, ?, ?, ?, ?, ?);',
                      [d.id, d.name, d.description, JSON.stringify(d.level), JSON.stringify(d.tasks), JSON.stringify(d.tags)]
                  );
              });
              AsyncStorage.setItem('databaseDownloadDate', JSON.stringify({"value": Date()}));
          })
          .catch((error) => {
              this.setState({internetConnection: false});
              alert('Błąd podczas pobierania danych szczegółowych testów.\nSprawdź połączenie z internetem!');
          });
  }
};

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
    Navigation.push(this.props.componentId, {
      component: {
        name: screen
      }
    })
  }

  goToDrawer = () => {
    Navigation.mergeOptions('drawerId', {
      sideMenu: {
        left: {
          visible: true
        },
      }
    });
  }
  newWindow2 = (window, id, name) => {
    Navigation.push(this.props.componentId, {
        component: {
            name: window,
            passProps: {
                id: id,
                nameTestProps: name,
            },
        }
    });
};


  


  


  render() {

    let rows = [];
        for (let i = 0; i < this.state.tests.length; i++) {
            rows.push(
                <View key={i} style={styles.view}>
                    <TouchableOpacity style={styles.buttonTest} key={i}
                                      onPress={() => this.newWindow2('Tests', this.state.tests[i].id, this.state.tests[i].name)}>
                        <Text style={styles.title}>{this.state.tests[i].name}</Text>
                        <Text></Text>
                        <Text style={styles.tags}>
                        {_.map(JSON.parse(this.state.tests[i].tags), x => ('#' + x + ' '))}
                        </Text>
                        <Text></Text>
                        <Text style={styles.description}>
                            {this.state.tests[i].description}
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }



    return (
  <View style={styles.container}>
      <View style={styles.toolbar} >
      <TouchableOpacity style={styles.drw} onPress={()=> this.goToDrawer()}><Image source={require('./img/menu.svg.png')} /></TouchableOpacity>
      <Text style={styles.textTab}>HOME PAGE</Text>
      </View>
    
      <ScrollView >
      <StatusBar
        backgroundColor="#4f6d7a"
        barStyle="light-content"
      />


 <ScrollView style={styles.appScreen}>
                    {rows}


      <View><Text></Text></View>
        <View style={styles.bottom}>
        <Text style={styles.txtBottom}> Get to know your ranking result</Text>
        <TouchableOpacity style={styles.button} onPress={()=> this.newScreen('Results')}>
          <Text>Check!</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        <View>
          
        </View>
            <Regulations pagekey={"uniquekey"} title={"Regulamin"} description={"1. Z Aplikacji mogą korzystać pełnoletnie osoby fizyczne, będące konsumentami w rozumieniu art. 22 (1) ustawy z dnia 23 kwietnia 1964 r. Kodeks cywilny, zwane dalej Użytkownikami. \n\n2. Użytkownik może pobrać Aplikację na swoje urządzenie mobilne w dowolnej chwili. Po pobraniu Aplikacji, Użytkownik może ją zainstalować na swoim urządzeniu przenośnym. Za pobranie Aplikacji lub jej zainstalowanie nie są pobierane opłaty. \n\n3. W celu pobrania, zainstalowania oraz korzystania z Aplikacji, z zastrzeżeniem pkt. 6 poniżej, Użytkownik powinien posiadać dostęp do Internetu."}/>
        </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  toolbar: {
    backgroundColor: '#60A510',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  drw: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#60A510',
    height: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#F5FCFF'
  },
  OpenSans: {
    fontFamily: 'OpenSans-Regular'
  },
  instructions: {
    textAlign: 'center',
    color: '#F5FCFF',
    marginBottom: 5,
  },
  button: {
    marginLeft: 90,
    height: 43, 
    width: 160,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderRadius: 5
  },
  textTab: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 80,
    marginTop: 12,
    fontSize: 20
  },
  bottom: {
    borderWidth: 2,
    padding: 5
  },
  txtBottom: {
    fontSize: 17,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center'
  },
  buttonTest: {
    marginLeft: 30,
    height: 170, 
    width: 300,
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderRadius: 5
  },
  title: {
    fontFamily: 'OpenSans-Bold',
  },
  tags: {
    fontFamily: 'OpenSans-Regular',
    color: '#5381F2'
  },
  description: {
    fontFamily: 'OpenSans-Regular',
  }
});
