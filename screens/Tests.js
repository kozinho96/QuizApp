import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';
import SQLite from 'react-native-sqlite-storage';

var db = SQLite.openDatabase({name: 'database.db', createFromLocation: '~www/database.db'});


export default class Tests extends Component {
    constructor() {
        super();
        this.state = {
            refreshing: false,
            tests: [
                {
                    question: '',
                    answers: {
                        content: '',
                        isCorrect: false
                    }
                }
            ]
        };

        this.currentQuestion = 0;
        this.testLength = 0;
        this.score = 0;
    }

    componentDidMount() {
        this._selectDataFromTable();
    }


    _selectDataFromTable(){
        db.transaction((tx) => {
            tx.executeSql('SELECT tasks FROM main.tests WHERE id = ?',[this.props.id]  , (tx, results) => {
                this.setState({refreshing: true});
                this.setState({ tests: JSON.parse(results.rows.item(0).tasks) });
                this.testLength = this.state.tests.length;
                this.setState({refreshing: false});
            });

        });
    }





    _onRefresh = () => {
        this.setState({refreshing: true});

            this.currentQuestion++;

        this.setState({refreshing: false});

    };

    next = (isCorrect) => {
        if(this.testLength === this.currentQuestion+1){
            if (isCorrect){
                this.score++;
            }
            Navigation.push('MAIN_STACK',{

                component: {
                    name: 'Score',
                    passProps: {
                        scoreTestProps: this.score,
                        testLengthProps: this.testLength,
                        nameTestProps: this.props.nameTestProps,

                    },
                }
            })
        }else{
            if( isCorrect ) {
                this.score++;
            }
            this._onRefresh();
        }

    };

    goToDrawer = () => {
        Navigation.mergeOptions('drawerId', {
            sideMenu:{
                left:{
                    visible:true
                }
            }
        })
    };




render() {

    let rowsAnswers = [];

    for (let i = 0; i < this.state.tests[0].answers.length; i++) {
        rowsAnswers.push(

            <TouchableOpacity key={i} style={styles.buttonTests}
                              onPress={() => this.next(this.state.tests[this.currentQuestion].answers[i].isCorrect)}>
                <Text style={styles.test1}>
                    {this.state.tests[this.currentQuestion].answers[i].content}
                </Text>
            </TouchableOpacity>
        );
    }




return (
  <View style={styles.container}>
            <View style={styles.toolbar}>
      <TouchableOpacity style={styles.drw} onPress={()=> this.goToDrawer()}><Image source={require('../img/menu.svg.png')} /></TouchableOpacity>
      <Text style={styles.textTab}>TESTS</Text>
      </View>
      
      <View>
      <Text style={styles.test3}>Pytanie {this.currentQuestion + 1} z {this.testLength}</Text>
                  <Text style={styles.test2}>{this.state.tests[this.currentQuestion].question}</Text>


{rowsAnswers}
    </View>
  </View>
);
}


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  toolbar: {
    backgroundColor: '#60A510',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  textTab: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 90,
    marginTop: 12,
    fontSize: 20
  },
    drw: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#60A510',
        height: 50
      },
      test2: {
          textAlign: 'center',
          fontFamily: 'OpenSans-Regular',
          fontSize: 20
      },
      test3: {
        textAlign: 'center',
        fontFamily: 'OpenSans-Bold',
        fontSize: 20
    },
    buttonTests: {
        alignItems: 'center',
        height: 80, 
        width: '100%',
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 2,
        borderRadius: 5
    },
    test1: {
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        marginTop: 10
    },
});
