
// import components needed to build app
import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [background, setBackground] = useState('');
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

    return (
        <ImageBackground source={require('../imgs/Background Image.png')} style={styles.bgImage} resizeMode='cover'>
            <Text style={styles.title}>QuickChat</Text>
            {/* Input and color choosing box */}
            <View style={styles.container}>
                {/* Input username */}
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder='Your Name'
                />
                <Text style={styles.chooseBgColor}>Choose Background Color</Text>
                {/* Choose Background Color buttons */}
                <View style={styles.colorSelect}>
                    {colors.map((color, index) => (
                        <TouchableOpacity
                            style={[styles.colorButtons, { backgroundColor: color }, background === color && styles.selected]}
                            key={index}
                            onPress={() => setBackground(color)} />
                    ))}
                </View>
                {/* Start Chatting Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Chat', { name: name, background: background })}>
                    <Text style={styles.chatButton}>Start Chatting</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

// styles for the components
const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: '#ffffff',
        width: '88%',
        height: '44%',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-evenly',
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 40
    },
    textInput: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        width: '88%',
        opacity: 50,
        padding: 15,
        borderWidth: 1,
        marginTop: '8%',
        marginBottom: 15,
        top: 5,
        borderColor: '#757083',
    },
    chooseBgColor: {
        flex: 1,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        marginTop: 20,
    },
    colorSelect: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: "space-between",
        top: 5,
        bottom: 5
    },
    colorButtons: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10
    },
    selectedColor: {
        borderColor: 'blue',
        borderWidth: '2'
    },
    button: {
        backgroundColor: '#757083',
        padding: 15,
        margin: 20,
        alignItems: 'center',
        width: '88%'
    },

});

export default Start;