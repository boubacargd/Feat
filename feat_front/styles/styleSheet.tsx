import { StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';  // Assurez-vous que le chemin est correct
import { Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const useStyles = () => {
    const { themeBorderColor, themeTextStyle, themeBackgroundColorBtn, themeScreenStyle, themeContainerStyle} = useTheme();

    return StyleSheet.create({
        header: {
            fontSize: 12,
            backgroundColor: 'black',
            height: 70,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingVertical: 8,
        },
      
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignContent: 'center',
            width,
            backgroundColor:themeScreenStyle,
        },
      
        textH1Bold: {
            fontSize: 20,
            fontWeight: "bold"
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
        button: {
            padding: 12,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: themeBorderColor,
        },
        buttonAddimg: {
            padding: 12,
            width: "95%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: themeBorderColor,

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
        /* --------------- */
        /* REGISTER styles */
        containerForm: {
            flex: 1,
            justifyContent: 'space-between',
            width,
            marginTop: 50,
            paddingLeft: 10,
            paddingRight: 10,

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
        },
        authBtn: {
            borderRadius: 8,
            backgroundColor: themeBorderColor,
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
        authBtnLogin: {
            borderRadius: 8,
            backgroundColor: themeBorderColor,
            padding: 12,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 15,
        },
        authBtnLoginGoogle: {
            borderRadius: 8,
            borderColor: themeBorderColor,
            borderWidth: 1,
            padding: 12,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
        },
        passwordForget: {
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingBottom: 5,
        },
        lineOr: {
            flex: 1,
            height: 1,
            backgroundColor: themeBorderColor,
            opacity: 0.4,
            width: 10,

        },
        desInput:{
            fontSize: 15,
            width: "100%",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            borderColor: themeBorderColor,
            color: themeTextStyle.color,
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
        /* Profile styles */
        containerUserInfo: {
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#fff",
            width:"100%",
            borderRadius: 12,
            padding: 15,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },

      
        profileActionsBtn: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            borderColor: themeBorderColor,
            borderWidth: 1,
          
            alignItems: "center",
            borderRadius: 8,

        },
        /* --------------- */
        /* User stats styles */

        containerUserStats: {
            width:"100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignSelf:"center",
            padding: 10,
            backgroundColor: themeContainerStyle.backgroundColor,
            borderRadius: 12,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            
        },
        viewStats: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        },
        middleStats: {
            borderLeftWidth: 1,
            borderRightWidth: 1,
            paddingHorizontal: 10,
        },
        textStats: {
            fontSize: 16,
            fontWeight: "bold",
        },
        textLabel: {
            fontSize: 14,
            color: "gray",
        },

        /* ---------------- */

    
        /* add post */
        postButton:{
            position:"absolute",
            bottom:20,
            right:30,
            backgroundColor: themeBackgroundColorBtn.backgroundColor,
            borderRadius: 5, 
        },
        modalContainer: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)", // Fond semi-transparent
            justifyContent: "center",
            alignItems: "center",
            bottom:0,
            
        },
        modalContent: {
            width: "100%",
            height:"70%",
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 10,
            bottom:0,
            position:"absolute"
        },
        closeButton: {
            alignSelf: "flex-end",
            padding: 10,
        },

        imageContainer: {
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
        },
        imagePreview: {
            width: width * 0.8,
            height: 300,
            borderRadius: 10,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
        },

        buttonText: {
            fontSize: 16,
            fontWeight: "bold",
        },
        input: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginVertical: 10,
        },
        shareButton: {
            marginTop: 20,
            padding: 15,
            backgroundColor: "#007BFF",
            borderRadius: 8,
            alignItems: "center",
        },
        shareText: {
            color: "#fff",
            fontWeight: "bold",
        },
        /* Post liste styles */
        containerPostList: {
            flex: 1,
            width:"100%",
            marginTop:20,
        },
        postCard: {
            backgroundColor: themeContainerStyle.backgroundColor,
            borderRadius: 12,
            padding: 15,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        userInfoPost: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
        },
        userImage: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 10,
        },
        userName: {
            color:themeTextStyle.color,
            fontSize: 16,
            fontWeight: "bold",
        },
        postTime: {
            fontSize: 12,
            color: themeTextStyle.color,
        },
        moreIcon: {
            marginLeft: "auto",
        },
        postContent: {
            fontSize: 14,
            color: themeTextStyle.color,
            marginBottom: 15,
        },
        postImages: {
            marginBottom: 15,
        },
        postImage: {
            width: 200, 
            height: 150,
            borderRadius: 8,
            marginRight: 10, 
        },
    
        reactions: {
            flexDirection: "row",
        },
        reaction: {
            fontSize: 18,
            marginRight: 10,
        },
        stats: {
            flexDirection: "row",
        },
        statsText: {
            fontSize: 12,
            color: themeTextStyle.color,
            marginRight: 15,
        },
        actions: {
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingTop: 10,
            marginBottom: 15,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            paddingRight:10,
        },
        actionText: {
            marginLeft: 5,
            fontSize: 14,
            color: themeTextStyle.color,
        },
        commentSection: {
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: themeBorderColor,
        },
        comment: {
            fontSize: 14,
            color: themeTextStyle.color,
        },
        iconPost:{
            paddingRight:10,
            color:themeTextStyle.color
        },
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainerPost: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '100%',
            alignItems: 'center',
            zIndex:100
        },
        modalOption: {
            fontSize: 18,
            padding: 10,
            textAlign: 'center',
            color: '#333',
        },
        buttonShare:{
            borderRadius: 8,
            backgroundColor: themeBorderColor,
            padding: 12,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 15,
        },
        
        /* ----------- */
        /* project collabs btn */
        containerPojectsCollabsBtn: {
            flexDirection: "row",
            backgroundColor: themeContainerStyle.backgroundColor,
            padding: 5,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        buttonProjectsCollabs: {
            flex: 1, // Prend une largeur égale dans le conteneur
            paddingVertical: 8,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
        },
        activeButton: {
            backgroundColor: "#ededed", // Couleur de fond du bouton actif
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
        },
        buttonTextProjectsCollabs: {
            fontSize: 14,
            color: themeTextStyle.color, // Couleur du texte par défaut
            fontWeight: "500",
        },
        activeButtonText: {
            color: "black", // Couleur du texte actif
            fontWeight: "bold",
        },
        /* ------- */
    });
};

export default useStyles;
