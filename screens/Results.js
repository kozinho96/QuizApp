import React, {Component} from 'react';
import {StyleSheet, Text, View, ListView, ScrollView, RefreshControl, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {Navigation} from 'react-native-navigation';


export default class Results extends Component {
  constructor() {
    super();
    this.state = {
        isLoading: true,
        clonedResults: [],
        refreshing: false,
    };
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

_onRefresh = () => {
  this.setState({refreshing: true});
  return this.fetchData().then(() => {
    this.setState({refreshing: false});
  })

};

fetchData() {
  return fetch("https://pwsz-quiz-api.herokuapp.com/api/results")
      .then((response) => response.json())
      .then((responseJson) => {
          var standardDataSource = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
          this.setState({
              isLoading: false,
              clonedResults: standardDataSource.cloneWithRows(responseJson)
          })
      })
}

componentDidMount() {
  fetch("https://pwsz-quiz-api.herokuapp.com/api/results")
      .then((response) => response.json())
      .then((responseJson) => {
          var standardDataSource = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
          this.setState({
              isLoading: false,
              clonedResults: standardDataSource.cloneWithRows(responseJson)
          })
      })
}

  render() {

if(this.state.isLoading){
  return(
      <View>
          <ActivityIndicator />
      </View>
  )
}

  return (
    <View style={styles.container}>
    <View style={styles.toolbar}>
    <TouchableOpacity style={styles.drw} onPress={()=> this.goToDrawer()}><Image source={require('../img/menu.svg.png')} /></TouchableOpacity>
    <Text style={styles.textTab}>RESULTS</Text>
    </View>
    <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}/>
                }>

        <Table style={styles.table} >
            <Row data={['Nick', 'Score', 'Total', 'Type', 'Date']} style={styles.head} flexArr={[1, 0.8, 0.8, 1.2,1.5]} textStyle={styles.textTabb}/>
              <ListView
                  dataSource = {this.state.clonedResults}
                  renderRow = {
                  (rowData) => <Row data={[rowData.nick, rowData.score, rowData.total, rowData.type,rowData.date]}  textStyle={styles.text} flexArr={[1, 0.8, 0.8, 1.2,1.5]}/>
              }>
          </ListView>
        </Table>
    </ScrollView>
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
  table: {
    width: '100%'
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
    Text: {
      padding: 40
    },
    head: { height: 40, backgroundColor: 'silver'},
    text: { margin: 3 , textAlign: 'center'},
    textTabb: {
      fontWeight: 'bold',
      textAlign: 'center',
    }
});