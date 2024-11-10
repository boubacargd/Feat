import { StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';  // Assurez-vous que le chemin est correct
import { Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const useStyles = () => {
    const { themeBorderColor, themeTextStyle } = useTheme();

    return StyleSheet.create({
        header: {
            fontSize: 12,
            backgroundColor: 'black',
            height: 70,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingVertical: 8,
        },
        title: {
            fontSize: 20,
        },
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignContent: 'center',
            paddingLeft: 5,
            paddingRight: 5,
        },
        text: {
            fontSize: 18,
        },
        textH3: {
            fontSize: 15,
        },
        textH3Bold: {
            fontSize: 15,
            fontWeight: "bold"
        },
        textH3Placeholder: {
            fontSize: 15,
            color: "#6a6a6a",
        },
        textH4: {
            fontSize: 12,
        },
        /* Auth styles */
     
        authAsk: {
            display: "flex",
            justifyContent: "space-around",
            width,
            height: "20%",
            position: "absolute",
            bottom: 0,
            borderTopColor: themeBorderColor,
            borderTopWidth: 1,
            paddingLeft: -20,
            paddingRight: -20,
        },
        /* ----------- */
        /* REGISTER styles */
        containerForm: {
            flex: 1,
            justifyContent: 'space-between',
            width,
            marginTop: 50,
            paddingLeft: 15,
            paddingRight: 15,

        },
        authInput: {
            fontSize: 15,
            width: "100%",
            borderWidth: 1,
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            borderColor: themeBorderColor,
            color: themeTextStyle.color,
            marginTop: 10,
        },
        navForm: {
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 10,
            alignItems: "center"
        },
        continueBtn: {
            borderRadius: 8,
            backgroundColor: themeBorderColor,
            padding: 10,
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        askAccountText: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width,
        },
        authBtn: {
            borderRadius: 8,
            backgroundColor: "#4eb8ff",
            padding: 12,
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        authBtnText: {
            fontSize: 15,
            fontWeight: "bold",
            color: "white"
        },
        /* --------------- */
        /* LOGIN styles */
        authBtnLogin:{
            borderRadius: 8,
            backgroundColor: "#4eb8ff",
            padding: 12,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop:10,
            marginBottom:25,
        },
        /* ------------ */
        /* Picker Country style */
        picker: {
            fontSize: 15,
            width: "100%",
            borderWidth: 1,
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            borderColor: themeBorderColor,
            color: themeTextStyle.color,
            marginTop: 10,
        },
        /* ----------------- */
    });
};

export default useStyles;
