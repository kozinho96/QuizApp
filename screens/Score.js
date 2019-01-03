import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from 'react-native';
import {Navigation} from 'react-native-navigation';

export default class Score extends Component{
    constructor() {
        super();
        this.state = {
            user: ''
        };
    }

    formatDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        today = yyyy + '-' + mm + '-' + dd;

        return today;
    }


    sendResult = () => {
        fetch('https://pwsz-quiz-api.herokuapp.com/api/result', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nick: this.state.user,
                score: this.props.scoreTestProps,
                total: this.props.testLengthProps,
                type: this.props.nameTestProps,
                date: this.formatDate()
            })
        });
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Results'
            }
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
    

    render() {
        return (
            <View style={styles.container}>
        <View style={styles.toolbar}>
             <TouchableOpacity style={styles.drw} onPress={()=> this.goToDrawer()}><Image source={require('../img/menu.svg.png')} /></TouchableOpacity>
             <Text style={styles.textTab}>SCORE</Text>
        </View>
        <View style={styles.cnt}>
                <Text style={styles.txtScore}>Your Score</Text>
                <Text style={styles.txtScore}>{this.props.scoreTestProps} / {this.props.testLengthProps} </Text>
                <Text style={styles.nick}>Give Your Nick</Text>
                <TextInput
                        style={{height: 40, width:280, borderColor: 'black', borderWidth: 1, textAlign: 'center', marginBottom: 20, marginLeft: 37,borderRadius:5, fontSize: 18}}
                        onChangeText={(user) => this.setState({user})}
                        value={this.state.user}
                    />


        <View style={styles.bottom}>
        <Text style={styles.txtBottom}>Send and get to know your ranking result</Text>
        <TouchableOpacity style={styles.button} onPress={()=> this.sendResult('Results')}>
          <Text>Send and Check!</Text>
        </TouchableOpacity>
            </View>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
    textTab: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginLeft: 100,
        marginTop: 12,
        fontSize: 20
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
    bottom: {
        borderWidth: 2,
        padding: 5,
    },
    cnt: {
        justifyContent: 'center',
        flex: 1
    },
    txtBottom: {
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center'
    },
    txtScore: {
        textAlign: 'center',
        fontFamily: 'OpenSans-Bold',
        color: '#60A510',
        fontSize: 30
    },
    nick: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    }
});
