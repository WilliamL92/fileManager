fileManager({
    container: "container",
    borderRadius: 5,
    borderWidth: 2,
    outerBorderShow: false,
    leftPanelWidth: 200,
    topPanelHeight: 50,
    textHeight: 20,
    topBackgroundColor: "#4F4F4F",
    leftBackgroundColor: "#757575",
    rightBackgroundColor: "#757575",
    textColor: "white",
    borderColor: "white",
    borderShow: true,
    buttonHeight: 25,
    onAddFolderFocus: () => {
        console.log("Add Folder !")
    },
    onImportFileFocus: () => {
        console.log("Import a File !")
    },
    onGoBackFocus: () => {
        console.log("Going back !")
    },
    onGoForwardFocus: () => {
        console.log("Going forward !")
    }
})