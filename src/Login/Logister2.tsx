import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Platform, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import MainURL from "../../MainURL";
import AsyncSetItem from '../AsyncSetItem'
import { Typography } from '../Components/Typography';

function Logister2 (props : any) {

  const schoolToggleModal = () => {
    setSchoolModalVisible(!isSchoolModalVisible);
  };
  const [isSchoolModalVisible, setSchoolModalVisible] = useState(false);

  const schNumToggleModal = () => {
    setSchNumModalVisible(!isSchNumModalVisible);
  };
  const [isSchNumModalVisible, setSchNumModalVisible] = useState(false);

  const partToggleModal = () => {
    setPartModalVisible(!isPartModalVisible);
  };
  const [isPartModalVisible, setPartModalVisible] = useState(false);

  const routeDataSet = () => {
    if(props.route.params === null || props.route.params === undefined) {
      return
    } else {
      const routeData = props.route.params.data;
      setRouteData(routeData);
      setRefreshToken(routeData.refreshToken);
      setUserAccount(routeData.email);
      setUserURL(routeData.userURL);
      {
        routeData.name && setUserName(routeData.name);
      }
    }
  }

  useEffect(()=>{
    routeDataSet();
  }, [])

  const [routeData, setRouteData] = useState({});
  const [refreshToken, setRefreshToken] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [userSchool, setUserSchool] = useState('');
  const [userSchNum, setUserSchNum] = useState('');
  const [userPart, setUserPart] = useState('');
  const [userURL, setUserURL] = useState('');
  
  const schools = ["가천대", "경북대", "경희대", "계명대", "국민대", 
    "군산대", "단국대", "대구가톨릭대", "목원대", "서울대", "서울사이버대", 
    "성신여대", "수원대", "숙명여대", "연세대", "영남대", "이화여대", "전북대", "전주대", 
    "제주대", "중앙대", "추계예대", "한세대", "한양대", "한예종", "일반대", "고등학생"]

  const sch_num = ["25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", 
          "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01", "00", "99+", "청소년"]

  const part = ["Sop.", "Mez.", "Ten.", "Bar.", "Bass.", "비전공"]


  // 회원가입하기 함수
  const handleSignup = () => {

    const userData = {
      ...routeData,
      userSchool: userSchool,
      userSchNum: userSchNum,
      userPart: userPart,
    }
     
    axios
      .post(`${MainURL}/login/logisterdo`, {
        userData : userData
      })
      .then((res) => {
        if (res.data === userAccount) {
          Alert.alert('회원가입이 완료되었습니다!');
          AsyncSetItem(refreshToken, userAccount, userName, userSchool, userSchNum, userPart, userURL);
          props.navigation.navigate('Result');
        } else {
          Alert.alert('다시 시도해 주세요.');
        }
      })
      .catch(() => {
        console.log('실패함');
      });
  };

  const alertSignup = () => { 
    Alert.alert('중요 공지', '성악하는대학생들은, 효율적인 어플 운영을 위해 회원님들의 정확한 프로필을 필요로 합니다. 가입된 정보가 사실과 다를 경우, 어플 사용에 제한이 있을 수 있습니다.', [
      { text: '가입 취소', onPress: () => { return }},
      { text: '확인', onPress: () => handleSignup() }
    ]);
  }
  
  const alertPageOut = () => { 
    Alert.alert('작성한 모든 내용이 지워집니다.', '나가시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '나가기', onPress: () => handlePageOut() }
    ]);
  }

  const handlePageOut = () => {
    setUserAccount('');
    setUserName('');
    setUserSchool('');
    setUserSchNum('');
    setUserPart('');
    props.navigation.navigate("Login");
  };

  return (
    <View style={Platform.OS === 'android' ? styles.android : styles.ios}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
        style={{flex:1}}
      >
      <ScrollView style={styles.container}>
      
        <View style={{alignItems: 'center', marginVertical: 20, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              props.navigation.goBack();
            }}
            >
            <EvilIcons name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Typography>회원가입</Typography>
        </View>
        
        <View style={{flex:1, marginVertical: 20}}>
          <View style={{flexDirection:'row', marginVertical:10}}>
            <View style={{width:40, height:50, alignItems: 'center'}}>
              <Image source={require('../images/login/note2_2.png')} style={{width:12, height:20}}/>
              <Typography fontSize={24} fontWeight='600' color='#ccc'>01</Typography>  
            </View>
            <View style={{marginHorizontal:10}}>
              <View style={{width:40, height:33}}></View>
              <View style={{width:40, height:2, backgroundColor: '#ccc'}}></View>
            </View>
            <View style={{width:40, height:50, alignItems: 'center'}}>
              <Image source={require('../images/login/note2_1.png')} style={{width:12, height:20}}/>
              <Typography fontSize={24} fontWeight='600'>02</Typography>  
            </View>
          </View>
          <Typography fontSize={22} fontWeight='600'>
            마지막으로 재학중인{'\n'}
            학교와 학번, 파트를 알려주세요.
          </Typography>
        </View>
        
        <View style={{flex:2}}>
          {/* 학교선택 */}
          
          <TouchableOpacity
            onPress={schoolToggleModal}
          >
            <View style={{flexDirection:'row', width: '90%', alignItems:'center'}}>
              <Typography color='#8C8C8C'>학교 <Typography color='#E94A4A'>*</Typography></Typography>
              <View style={[styles.input, {width: '88%'}]}>
                <Typography fontSize={12} color='gray'>
                  {userSchool === '' ? '재학 중인 학교를 선택해 주세요' : userSchool}
                </Typography>
              </View>
              <AntDesign name="down" size={12} color="black"/> 
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSchoolModalVisible}
            onRequestClose={schoolToggleModal}
          >
            <View style={{ width: '100%', position: 'absolute', bottom:0, borderRadius: 20, backgroundColor: 'white', 
                          padding: 20}}>
                <Typography marginBottom={10}>학교선택</Typography>
                <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap:'wrap', }}>
                {
                  schools.map((item, index)=>{
                    return(
                      <TouchableOpacity 
                        key={index} 
                        onPress={()=>{
                          setUserSchool(item);
                          schoolToggleModal();
                        }} 
                        style={{width: '32%', height: 50, borderWidth:1, borderColor: '#EAEAEA'}}
                        >
                          <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Typography fontWeight='600' color='#353535' fontSize={13}>{item}</Typography>
                          </View>
                      </TouchableOpacity> 
                    )
                  })
                }
                </View>
                
            </View>
          </Modal>

          {/* 학번 선택 */}
          <TouchableOpacity
              onPress={schNumToggleModal}
            >
            <View style={{flexDirection:'row', width: '90%', alignItems:'center'}}>
              <Typography color='#8C8C8C'>학번 <Typography color='#E94A4A'>*</Typography></Typography>
              <View style={[styles.input, {width: '88%'}]}>
                <Typography fontSize={12} color='gray'>
                  {userSchNum === '' ? '학번을 선택해 주세요' : userSchNum}
                </Typography>
              </View>
              <AntDesign name="down" size={12} color="black"/> 
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSchNumModalVisible}
            onRequestClose={schNumToggleModal}
          >
            <View style={{ width: '100%', position: 'absolute', bottom:0, borderRadius: 20, backgroundColor: 'white', 
                          padding: 20}}>
                <Typography marginBottom={10}>학번선택</Typography>
                <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap:'wrap', }}>
                {
                  sch_num.map((item, index)=>{
                    return(
                      <TouchableOpacity 
                        key={index}   
                        onPress={()=>{
                          setUserSchNum(item);
                          schNumToggleModal();
                        }} 
                        style={{width: '32%', height: 50, borderWidth:1, borderColor: '#EAEAEA'}}
                        >
                          <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Typography fontWeight='bold' color='#8C8C8C' fontSize={13}>{item}</Typography>
                          </View>
                      </TouchableOpacity> 
                    )
                  })
                }
                </View>
            </View>
          </Modal>

          {/* 파트 선택  */}
          <TouchableOpacity
              onPress={partToggleModal}
            >
            <View style={{flexDirection:'row', width: '90%', alignItems:'center', marginBottom:10}}>
              <Typography color='#8C8C8C'>파트 <Typography color='#E94A4A'>*</Typography></Typography>
              <View style={[styles.input, {width: '88%'}]}>
                <Typography fontSize={12} color='gray'>
                  {userPart === '' ? '파트를 선택해 주세요' : userPart}
                </Typography>
              </View>
              <AntDesign name="down" size={12} color="black"/> 
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isPartModalVisible}
            onRequestClose={partToggleModal}
          >
            <View style={{ width: '100%', position: 'absolute', bottom:0, borderRadius: 20, backgroundColor: 'white', 
                          padding: 20}}>
                <Typography marginBottom={10}>파트선택</Typography>
                <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap:'wrap', }}>
                {
                  part.map((item, index)=>{
                    return(
                      <TouchableOpacity 
                        key={index}   
                        onPress={()=>{
                          setUserPart(item);
                          partToggleModal();
                        }} 
                        style={{width: '32%', height: 50, borderWidth:1, borderColor: '#EAEAEA'}}
                        >
                          <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Typography fontWeight='bold' color='#8C8C8C' fontSize={13}>{item}</Typography>
                          </View>
                      </TouchableOpacity> 
                    )
                  })
                }
                </View>
            </View>
          </Modal>

        </View>
        
        {/* 하단 버튼 */}
        <TouchableOpacity 
            onPress={()=>{
              userSchool && userSchNum && userPart 
              ? alertSignup() 
              : Alert.alert('모든 항목을 채워주세요')
            }}
            style={
              userSchool && userSchNum && userPart ? [styles.nextBtnBox, { backgroundColor: 'black'}] 
              : [styles.nextBtnBox, { backgroundColor: 'gray'}]
            }
            >
            <Text style={styles.nextBtnText}>가입완료</Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={alertPageOut}>
            <Text style={styles.linkButton}>나가기</Text>
          </TouchableOpacity>
        </View>

      
      </ScrollView>
      </KeyboardAvoidingView>

      <View style={ isSchoolModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
      <View style={ isSchNumModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
      <View style={ isPartModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>

    </View>
  );
};

const styles = StyleSheet.create({
  android: {
    flex: 1,
    backgroundColor: '#333',
  },
  ios : {
    flex: 1,
    backgroundColor: '#333',
    paddingTop: getStatusBarHeight(),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24
 },
 backButton: {
  position:'absolute',
  top: 0,
  left: 0,
  width: 30,
  height: 30,
},
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#DFDFDF',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#333'
  },  
  message: {
    marginBottom: 10,
  },
  success: {
    color: '#47C83E',
  },
  error: {
    color: '#F15F5F',
  },
  errorText: {
    color: '#F15F5F',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  nextBtnBox: {
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
});

export default Logister2;
