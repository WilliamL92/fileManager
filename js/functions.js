function fileManager(data) {
    let titleTop = data.titleTop || "fileManager"
    let titleLeft = data.titleLeft || "Files structure"
    let titleRight = data.titleRight || "files"
    let container = data.container || "container"
    let topBackgroundColor = data.topBackgroundColor || "white"
    let leftBackgroundColor = data.leftBackgroundColor || "white"
    let rightBackgroundColor = data.rightBackgroundColor || "white"
    let borderColor = data.borderColor || "black"
    let textColor = data.textColor || "black"
    let buttonHeight = data.buttonHeight || 25
    let borderWidth = data.borderWidth || 3
    let borderRadius = data.borderRadius || 5
    let outerBorderShow
    let borderShow
    typeof (data.outerBorderShow) === "undefined" ? outerBorderShow = true : outerBorderShow = data.outerBorderShow
    typeof (data.borderShow) === "undefined" ? borderShow = true : borderShow = data.borderShow
    let leftPanelWidth = data.leftPanelWidth || 150
    let topPanelHeight = data.topPanelHeight || 50
    let textHeight = data.textHeight || 30
    let textStyle = data.textStyle || "Sans-serif"
    let cardTextHeight = data.cardTextHeight || 20
    let cardHeight = data.cardHeight || ""
    let cardMaxTextLength = data.cardMaxTextLength || -1
    let cardBackGroundColorOnFocus = data.cardBackGroundColorOnFocus || "#6A8E9A"
    let cardBackGroundColorOnClick = data.cardBackGroundColorOnClick || "#1E99C4"
    let fileCardTextHeight = data.fileCardTextHeight || 17
    let fileCardMaxTextLength = data.fileCardMaxTextLength || 10
    let rightClickCardBackgroundColor = data.rightClickCardBackgroundColor || "#9B9B9B"
    let rightClickCardTexts = data.rightClickCardTexts || ["rename", "delete"]
    let rightClickCardTextsHeight = data.rightClickCardTextsHeight || 18
    let rightClickCardTextSelection = data.rightClickCardTextSelection || "#16C7C4"
    let cardItemsElementsBackgroundColor = data.cardItemsElementsBackgroundColor || "#19CDCA"

    let currentPath = 0

    const updateVirtualPath = (path) => {
        $('#_virtualPath_').children().remove()
        $('#_virtualPath_').append(`<label style="white-space: nowrap;">${path}</label>`)
    }

    const addNewFile = (name) => {
        $('#importNewFile').off('change')
        $('#importNewFile')[0].click()
        $('#importNewFile').on('change', (e) => {
            const files = e.target.files
            let reader = new FileReader()
            reader.onload = (file) => {
                itemId++
                const item = getFolderById(currentPath)
                item.items.push({
                    name: `${name}(${itemId})`,
                    type: "FILE",
                    id: itemId,
                    active: false,
                    renameElement: false,
                    renameElementStructure: false,
                    data: reader.result
                })
                updateFilesItemsStructure()
                updateFilesItems(getFolderById(currentPath))
            }
            reader.readAsDataURL(files[0])
        })
    }

    const addNewFolder = (name) => {
        itemId++
        const item = getFolderById(currentPath)
        item.items.push({
            name: `${name}(${itemId})`,
            type: "FOLDER",
            id: itemId,
            active: false,
            renameElement: false,
            renameElementStructure: false,
            items: []
        })
        updateFilesItemsStructure()
        updateFilesItems(getFolderById(currentPath))
    }

    const setAllDefaultParameter = (obj) => {
        items = { ...items, ...obj }
        const recursive = (items) => {
            for (let i = 0; i < items.length; i++) {
                items[i] = { ...items[i], ...obj }
                if (items[i].type === "FOLDER") {
                    recursive(items[i].items)
                }
            }
        }
        recursive(items.items)
    }

    const selectItemElement = (element) => {
        $('#_menuSelection').remove()
        $('._filesItemsElementSelected_').parent().css('backgroundColor', '')
        element.css('backgroundColor', cardItemsElementsBackgroundColor)
    }

    const renameItemByElement = (div, type) => {
        const elemId = +div[0].id.split('_').at(-1)
        if (type === "element") {
            editFolderById(elemId, { renameElement: true })
        }
        else if (type === "elementStructure") {
            editFolderById(elemId, { renameElementStructure: true })
        }
        updateFilesItems(getFolderById(currentPath), elemId)
        updateFilesItemsStructure(div)
    }

    const getTopFolderId = (id) => {
        let currentId = 0
        let find = false
        const recursive = (items, _id) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id !== id) {
                    recursive(items[i].items, items[i].id)
                }
                else {
                    currentId = _id
                    find = true
                }
            }
        }
        recursive(items.items, 0)
        if (!find) {
            currentId = 0
        }
        return currentId
    }

    const showMenuRightClick = (target, pos, idFolder) => {
        $(`#_menuSelection`).remove()
        $(target).append(`<div style="background-color: ${rightClickCardBackgroundColor}; position: absolute; width: 150px; margin-left: ${pos.x}px;margin-top: ${pos.y}px; text-align: start;" id="_menuSelection">
            ${rightClickCardTexts.map((e, i) => `<div style="width: 100%; position: relative;" id="_labelRightClickSelection_${i}" class="_labelRightClickSelection_"><label style="font-size: ${rightClickCardTextsHeight}px; margin-left: 15px; pointer-events: none;">${e}</label></div>`).join('')}
        </div>`)
        $('._labelRightClickSelection_').on('mouseenter', (e) => {
            $('._labelRightClickSelection_').css('backgroundColor', '')
            $(e.target).css('backgroundColor', rightClickCardTextSelection)
        })
        $('._labelRightClickSelection_').on('mouseleave', (e) => {
            $('._labelRightClickSelection_').css('backgroundColor', '')
        })
        $('._labelRightClickSelection_').on('click', (e) => {
            switch (+e.target.id.split('_').at(-1)) {
                case 0:
                    if (target.attr('class') === "_fileItemStructureElement_" || target.attr('class')?.split(' ')[1] === "_fileElementStructure_") {
                        renameItemByElement(target, "elementStructure")
                    }
                    else {
                        renameItemByElement(target, "element")
                    }
                    break
                case 1:
                    if (currentPath === idFolder) {
                        currentPath = getTopFolderId(idFolder)
                        updateVirtualPath(getPathName(currentPath))
                    }
                    deleteFolderById(idFolder)
                    updateFilesItemsStructure()
                    updateFilesItems(getFolderById(currentPath))
                    break
            }
        })
    }

    const updateFilesItems = (item, selectedItem) => {
        const cardWidth = 70
        $(`#_filesItems`).children().remove()
        for (let i = 0; i < item.items.length; i++) {
            if (item.items[i].type === "FOLDER") {
                $(`#_filesItems`).append(`<div style="height: min-content; padding-bottom: 5px;">
                <div style="width: ${cardWidth}px; height: ${cardWidth}px; margin: 10px 15px;" class="_filesItemsElementSelected_" id="_filesItemsElementSelected_${item.items[i].id}">
                    <div style="width: ${cardWidth - 10}px; height: ${cardWidth - 10}px; margin-left: 5px; margin-top: 5px; pointer-events: none;">
                        <svg style="fill: ${textColor}; width: ${cardWidth - 10}px; pointer-events: none;" viewBox="0 0 512 512"><path style="pointer-events: none;" d="M447.1 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H63.1c-35.35 0-64 28.66-64 64v320c0 35.34 28.65 64 64 64h384c35.35 0 64-28.66 64-64V160C511.1 124.7 483.3 96 447.1 96zM463.1 416c0 8.824-7.178 16-16 16h-384c-8.822 0-16-7.176-16-16V96c0-8.824 7.178-16 16-16h117.5c4.273 0 8.293 1.664 11.31 4.688L255.1 144h192c8.822 0 16 7.176 16 16V416z"/></svg>
                    </div>
                    ${item.items[i].renameElement ? `<input id="_renameTextElem_" type="text" value="${item.items[i].name}" style="width: 100%;"/>` : `<label style="font-size: ${fileCardTextHeight}px;">${item.items[i].name.length > fileCardMaxTextLength ? `${item.items[i].name.substring(0, fileCardMaxTextLength)}...` : item.items[i].name}</label>`}
                </div>
            </div>`)
            }
            else if (item.items[i].type === "FILE") {
                $(`#_filesItems`).append(`<div style="height: min-content; padding-bottom: 5px;">
                <div style="width: ${cardWidth}px; height: ${cardWidth}px; margin: 10px 15px;" class="_filesItemsElementSelected_" id="_filesItemsElementSelected_${item.items[i].id}">
                    <div style="width: ${cardWidth - 10}px; height: ${cardWidth - 10}px; margin-left: 5px; margin-top: 5px; pointer-events: none;">
                    <svg style="fill: ${textColor}; width: ${cardWidth - 25}px; pointer-events: none;" viewBox="0 0 384 512"><path style="pointer-events: none;" d="M0 64C0 28.65 28.65 0 64 0H229.5C246.5 0 262.7 6.743 274.7 18.75L365.3 109.3C377.3 121.3 384 137.5 384 154.5V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM336 448V160H256C238.3 160 224 145.7 224 128V48H64C55.16 48 48 55.16 48 64V448C48 456.8 55.16 464 64 464H320C328.8 464 336 456.8 336 448z"/></svg>
                    </div>
                    ${item.items[i].renameElement ? `<input id="_renameTextElem_" type="text" value="${item.items[i].name}" style="width: 100%;"/>` : `<label style="font-size: ${fileCardTextHeight}px;">${item.items[i].name.length > fileCardMaxTextLength ? `${item.items[i].name.substring(0, fileCardMaxTextLength)}...` : item.items[i].name}</label>`}
                </div>
            </div>`)
            }
        }
        $('#_renameTextElem_')[0]?.select()
        $(`._filesItemsElementSelected_`).on('mousedown', (e) => {
            let elemRef = $(e.target)
            let _id = elemRef.attr('id')
            if (elemRef.attr('class') !== "_filesItemsElementSelected_") {
                elemRef = elemRef.parent()
                _id = elemRef.parent().attr('id')
            }
            switch (e.which) {
                case 1:
                    if ($(e.target).attr('class') !== "_labelRightClickSelection_") {
                        setAllDefaultParameter({ renameElement: false, renameElementStructure: false })
                        updateFilesItems(getFolderById(currentPath))
                        updateFilesItemsStructure()
                        selectItemElement($(`#${_id}`).parent())
                    }
                    break
                case 3:
                    if ($(e.target).attr('class') !== "_labelRightClickSelection_") {
                        const decal = 85
                        selectItemElement(elemRef.parent())
                        setAllDefaultParameter({ renameElement: false, renameElementStructure: false })
                        updateFilesItemsStructure()
                        showMenuRightClick(elemRef, { x: Math.round(e.pageX - $("#_filesItems").scrollLeft() - $(elemRef).offset().left), y: Math.round(e.pageY - $("#_filesItems").scrollTop() - $(elemRef).offset().top) - decal }, +elemRef[0].id.split('_').at(-1))
                    }
                    break
            }
        })
        $('#_renameTextElem_').off('keypress')
        $('#_renameTextElem_').on('keypress', (e) => {
            if (e.keyCode === 13) {
                editFolderById(selectedItem, { name: $('#_renameTextElem_').val(), renameElement: false })
                updateFilesItemsStructure()
                updateFilesItems(getFolderById(currentPath))
            }
        })
    }

    const editFolderById = (id, obj) => {
        const recursive = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    items[i] = { ...items[i], ...obj }
                }
                else if (items[i].type === "FOLDER") {
                    recursive(items[i].items)
                }
            }
        }
        if (id !== 0) {
            recursive(items.items)
        }
        else {
            items = { ...items, ...obj }
        }
        updateFilesItemsStructure()
    }

    const deleteFolderById = (id) => {
        const _index = items.items.findIndex(e => e.id === id)
        if (_index === -1) {
            const recursive = (items) => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === id) {
                        items.splice(i, 1)
                    }
                    else if (items[i].type === "FOLDER") {
                        recursive(items[i].items)
                    }
                }
            }
            recursive(items.items)
        }
        else {
            items.items.splice(_index, 1)
        }
    }
    const getFolderById = (id) => {
        let findId = -1
        const recursive = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === "FOLDER" && items[i].id !== id) {
                    recursive(items[i].items)
                }
                else if (items[i].type === "FOLDER" && items[i].id === id) {
                    findId = items[i]
                }
            }
        }
        if (id === 0) {
            findId = items
        }
        else {
            recursive(items.items)
        }
        return findId
    }
    const manageCardName = (text) => {
        if (cardMaxTextLength !== -1 && text.length >= cardMaxTextLength) {
            return `${text.substring(0, cardMaxTextLength)}...`
        }
        return text
    }
    const getPathName = (id) => {
        let find = false
        let _path = "."
        const recursive = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === "FOLDER" && items[i].items.length >= 1 && items[i].id !== id && !find) {
                    _path += `/${items[i].name}`
                    recursive(items[i].items)
                }
                else if (items[i].id === id && items[i].type === "FOLDER" && !find) {
                    _path += `/${items[i].name}`
                    find = true
                }
            }
            if (!find) {
                _path = "."
            }
        }
        if (id !== 0) {
            recursive(items.items)
            if (!find) {
                _path += "/"
            }
        }
        else {
            _path += "/"
        }
        return _path
    }

    let marginTopElements = 25

    let itemId = 0 // Increment this value each time we add a new folder or file
    let items = {
        name: "root",
        id: 0,
        type: "FOLDER",
        active: true,
        items: [],
        renameElement: false,
        renameElementStructure: false
    }

    let fileManagerName = "__Item__FileManager__"
    $(`#${container}`).append(
        `<div oncontextmenu="return false;" style="width: 100%; height: 100%; box-sizing: border-box; border-radius: ${borderRadius}px; border: ${outerBorderShow ? `solid ${borderColor} ${borderWidth}px;` : "none"}; font-size: ${textHeight}px; font-family: ${textStyle}; color: ${textColor}; border-color: ${borderColor}; user-select: none;" id="_FileManager_">
            <div style="width: calc(100% + 1px); height: ${topPanelHeight}px; box-sizing: border-box; border-radius: ${borderRadius}px; display: flex; align-items: center; padding: 5px; background-color: ${topBackgroundColor}; border-color: ${borderColor}; border: ${borderShow ? `solid ${borderColor} ${borderWidth}px` : "none"};">
                <label>${titleTop}</label>
                <div class="${fileManagerName}" id="__addFolder" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                    <svg style="fill: ${textColor}; width: ${buttonHeight}px; pointer-events: none;" viewBox="0 0 512 512"><path style="pointer-events: none;" d="M447.1 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H63.1c-35.35 0-64 28.66-64 64v320c0 35.34 28.65 64 64 64h384c35.35 0 64-28.66 64-64V160C511.1 124.7 483.3 96 447.1 96zM463.1 416c0 8.824-7.178 16-16 16h-384c-8.822 0-16-7.176-16-16V96c0-8.824 7.178-16 16-16h117.5c4.273 0 8.293 1.664 11.31 4.688L255.1 144h192c8.822 0 16 7.176 16 16V416z"/></svg>
                </div>
                <div class="${fileManagerName}" id="__importFile" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                    <input type="file" id="importNewFile" style="display: none;" />
                    <svg style="fill: ${textColor}; height: ${buttonHeight}px; width: ${buttonHeight}px; pointer-events: none;" viewBox="0 0 384 512"><path style="pointer-events: none;" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg>
                </div>
                <div class="${fileManagerName}" id="__goBack" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                <svg style="fill: ${textColor}; width: ${buttonHeight}px; pointer-events: none;" viewBox="0 0 512 512"><path style="pointer-events: none;" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/></svg>
                </div>
                <div style="overflow-x: auto; width: 100%;" id="_virtualPath_">
                </div>
                <div class="${fileManagerName}" id="__goForward" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                    <svg viewBox="0 0 512 512" style="fill: ${textColor}; width: ${buttonHeight}px; pointer-events: none;"><path style="pointer-events: none;" d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z"/></svg>
                </div>
            </div>
            <div style="display: flex; width: 100%; height: 100%;">
                <div style="width: ${leftPanelWidth}px; height: calc(100% - ${topPanelHeight}px); box-sizing: border-box; border-radius: ${borderRadius}px; text-align: center; display: flex; flex-flow: column; overflow: auto; background-color: ${leftBackgroundColor}; border-color: ${borderColor}; border: ${borderShow ? `solid ${borderColor} ${borderWidth}px;` : "none"}">
                    <label>${titleLeft}</label>
                    <div id="_filesItemsStructure" style="width: 100%; overflow-y: scroll; height: 100%; font-size: ${cardTextHeight}px;"></div>
                </div>
                <div style="border-radius: ${borderRadius}px; width: calc(100% - ${leftPanelWidth}px); height: calc(100% - ${topPanelHeight}px); box-sizing: border-box; text-align: center; display: flex; flex-flow: column; overflow: auto; background-color: ${rightBackgroundColor}; border-color: ${borderColor}; border: ${borderShow ? `solid ${borderColor} ${borderWidth}px` : "none"};">
                    <label>${titleRight}</label>
                    <div id="_filesItems" style="width: 100%; overflow-y: scroll; height: 100%; display: flex; flex-wrap: wrap;"></div>
                </div>
            </div>
        </div>`
    )

    const updateFilesItemsStructure = (div) => {
        $(`#_filesItemsStructure`).children().remove()
        let margin = 1
        const decal = 15
        const addNewFolder = (id, active, name, renameElementStructure) => {
            $(`#_filesItemsStructure`).append(`<div id="_fileItemStructureElement_${id}" class="_fileItemStructureElement_" style="height: ${cardHeight}px; margin-left: calc((5px + ${(margin * decal)}px) - ${decal}px); margin-bottom: 5px; width: auto; padding: 0; width: max-content; ${currentPath === id ? `background-color:${cardBackGroundColorOnClick}` : ""}">
                <div style="display: flex; pointer-events: none;">
                    <div class="_activeCardChildren ${active ? "active" : "no-active"}" id="_FileStructure_${id}" style="padding: 0px; margin-left: 5px; pointer-events: auto; background-color:transparent; margin-top: -1px;">
                        ${active ? `<svg style="fill: ${textColor}; pointer-events: none; margin-left: 3px; width: 14px; height: 14px;" viewBox="0 0 320 512"><path style="pointer-events: none;" d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>` : `<svg viewBox="0 0 256 512" style="fill: ${textColor}; pointer-events: none; margin-left: 3px; width: 14px; height: 14px;">
                        <path style="pointer-events: none;" d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/>
                    </svg>`}
                    </div>
                    <div style="margin-left: 5px;">
                        <svg style="fill: ${textColor}; pointer-events: none; width: 14px; height: 14px;" viewBox="0 0 512 512"><path style="pointer-events: none;" d="M447.1 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H63.1c-35.35 0-64 28.66-64 64v320c0 35.34 28.65 64 64 64h384c35.35 0 64-28.66 64-64V160C511.1 124.7 483.3 96 447.1 96zM463.1 416c0 8.824-7.178 16-16 16h-384c-8.822 0-16-7.176-16-16V96c0-8.824 7.178-16 16-16h117.5c4.273 0 8.293 1.664 11.31 4.688L255.1 144h192c8.822 0 16 7.176 16 16V416z"/></svg>
                    </div>
                    ${renameElementStructure ? `<input id="_renameTextElem_" type="text" value="${name}" style="width: 100%;"/>` : `<label style="margin-left: 10px; pointer-events: none; white-space: nowrap; margin-right: 10px; font-size: ${fileCardTextHeight}px;">${name.length > fileCardMaxTextLength ? `${name.substring(0, fileCardMaxTextLength)}...` : name}</label>`}
                </div>
            </div>`)
        }
        const addNewFile = (id, active, name, renameElementStructure) => {
            $(`#_filesItemsStructure`).append(`<div id="_fileItemStructureElement_${id}" class="_fileItemStructureElement_ _fileElementStructure_" style="height: ${cardHeight}px; margin-left: calc((25px + ${(margin * decal)}px) - ${decal}px); margin-bottom: 5px; width: auto; padding: 0; width: max-content; ${currentPath === id ? `background-color:${cardBackGroundColorOnClick}` : ""}">
                <div style="display: flex; pointer-events: none;">
                    <div class="_activeCardChildren ${active ? "active" : "no-active"}" id="_FileStructure_${id}" style="padding: 0px; margin-left: 5px; pointer-events: auto; background-color:transparent; margin-top: -1px;">
                    <svg style="fill: ${textColor}; width: 12px; pointer-events: none;" viewBox="0 0 384 512"><path style="pointer-events: none;" d="M0 64C0 28.65 28.65 0 64 0H229.5C246.5 0 262.7 6.743 274.7 18.75L365.3 109.3C377.3 121.3 384 137.5 384 154.5V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM336 448V160H256C238.3 160 224 145.7 224 128V48H64C55.16 48 48 55.16 48 64V448C48 456.8 55.16 464 64 464H320C328.8 464 336 456.8 336 448z"/></svg>
                    </div>
                    ${renameElementStructure ? `<input id="_renameTextElem_" type="text" value="${name}" style="width: 100%;"/>` : `<label style="margin-left: 10px; pointer-events: none; white-space: nowrap; margin-right: 10px; font-size: ${fileCardTextHeight}px;">${name.length > fileCardMaxTextLength ? `${name.substring(0, fileCardMaxTextLength)}...` : name}</label>`}
                </div>
            </div>`)
        }
        const recursive = (items) => {
            margin++
            for (let i = 0; i < items.length; i++) {
                switch (items[i].type) {
                    case "FOLDER":
                        addNewFolder(items[i].id, items[i].active, items[i].name, items[i].renameElementStructure)
                        if (items[i].items.length >= 1 && items[i].active) {
                            recursive(items[i].items)
                        }
                        break
                    case "FILE":
                        addNewFile(items[i].id, items[i].active, items[i].name, items[i].renameElementStructure)
                }
            }
            margin--
        }
        addNewFolder(items.id, items.active, items.name)
        if (items.active) {
            recursive(items.items)
        }
        $('._activeCardChildren').on('mouseenter', (e) => {
            $("body").css('cursor', "pointer")
        })
        $('._activeCardChildren').on('mouseleave', (e) => {
            $("body").css('cursor', "default")
        })
        $('._activeCardChildren').on('mousedown', (e) => {
            let elemId = e.target.id
            $('#_menuSelection').remove()
            if ($(`#${elemId}`).attr('class').split(" ")[1] === "active") {
                $(`#${elemId}`).removeClass("active").addClass("no-active")
                editFolderById(+elemId.split('_')[2], { active: false })
            }
            else {
                $(`#${elemId}`).removeClass("no-active").addClass("active")
                editFolderById(+elemId.split('_')[2], { active: true })
            }
        })
        $('._fileItemStructureElement_').on('mouseenter', (e) => {
            let elemId = e.target.id
            if ($(e.target).attr('class').split(' ')[0] === "_activeCardChildren") {
                elemId = $(e.target).parent().parent()[0].id
            }
            if ($(`#${elemId}`).attr('class').split(' ')[0] !== "_activeCardChildren" && +elemId.split('_')[2] !== currentPath && $(`#${elemId}`).attr('class') !== "_labelRightClickSelection_") {
                $(`._fileItemStructureElement_ > :not(#${elemId}):not(#_menuSelection)`).css('backgroundColor', '')
                $(`#${elemId}`).css('backgroundColor', cardBackGroundColorOnFocus)
            }
        })
        $('._fileItemStructureElement_').on('mouseleave', (e) => {
            let elemId = e.target.id
            if ($(e.target).attr('class').split(' ')[0] === "_activeCardChildren") {
                elemId = $(e.target).parent().parent()[0].id
            }
            if (+elemId.split('_')[2] !== currentPath) {
                $(`#${elemId}`).css('backgroundColor', "")
            }
        })
        //------------------
        $('#_renameTextElem_')[0]?.select()
        $('#_filesItemsStructure > :not(._fileItemStructureElement_)').on('mousedown', (e) => {
            $('#_menuSelection').remove()
        })
        $(`._fileItemStructureElement_`).on('mousedown', (e) => {
            const _idFolder = +e.target.id.split('_').at(-1)
            if ($(e.target).attr('class').split(" ")[0] !== "_activeCardChildren") {
                switch (e.which) {
                    case 1:
                        if ($(e.target).attr('class') !== "_labelRightClickSelection_" && $(e.target).attr('class').split(' ')[1] !== "_fileElementStructure_") {
                            currentPath = _idFolder
                            updateVirtualPath(getPathName(currentPath))
                            setAllDefaultParameter({ renameElement: false, renameElementStructure: false })
                            currentPath = currentPath
                            updateFilesItemsStructure()
                            updateFilesItems(getFolderById(currentPath))
                        }
                        $('._fileItemStructureElement_').css('backgroundColor', '')
                        $(`#${e.target.id}`).css('backgroundColor', cardBackGroundColorOnClick)
                        break
                    case 3:
                        if ($(e.target).attr('class') !== "_labelRightClickSelection_" && +$(e.target).attr('id').split('_')[2] !== 0) {
                            const decal = 25
                            $(`._fileItemStructureElement_ > :not(#_menuSelection)`).css('backgroundColor', '')
                            setAllDefaultParameter({ renameElement: false, renameElementStructure: false })
                            updateFilesItems(getFolderById(currentPath))
                            showMenuRightClick($(e.target), { x: Math.round(e.pageX - $("#_filesItemsStructure").scrollLeft() - $(e.target).offset().left), y: Math.round(e.pageY - $("#_filesItemsStructure").scrollTop() - $(e.target).offset().top) - decal }, +$(e.target)[0].id.split('_').at(-1))
                        }
                        else if (+$(e.target).attr('id').split('_')[2] === 0) {
                            $('#_menuSelection').remove()
                        }
                        break
                }
            }
        })
        if (typeof (div) !== "undefined" && (div.attr('class') == "_fileItemStructureElement_" || div.attr('class')?.split(' ')[1] === "_fileElementStructure_")) {
            $('#_renameTextElem_').off('keypress')
            $('#_renameTextElem_').on('keypress', (e) => {
                if (e.keyCode === 13) {
                    editFolderById(+div.attr('id').split('_')[2], { name: $('#_renameTextElem_').val(), renameElementStructure: false })
                    updateFilesItemsStructure(div)
                    updateFilesItems(getFolderById(currentPath))
                }
            })
        }
    }
    updateVirtualPath(getPathName(currentPath))
    updateFilesItemsStructure()
    updateFilesItems(getFolderById(currentPath))

    $(`.${fileManagerName}`).on('mouseenter', (e) => {
        $("body").css('cursor', "pointer")
    })
    $(`.${fileManagerName}`).on('mouseleave', (e) => {
        $("body").css('cursor', "default")
    })

    $(`.${fileManagerName}`).on('click', (e) => {
        let elemId = e.target.id

        switch (elemId) {
            case "__addFolder":
                if (typeof (data.onAddFolderFocus) !== "undefined") {
                    data.onAddFolderFocus()
                }
                addNewFolder("folder")
                break
            case "__importFile":
                if (typeof (data.onImportFileFocus) !== "undefined") {
                    data.onImportFileFocus()
                }
                addNewFile("file")
                break
            case "__goBack":
                if (typeof (data.onGoBackFocus) !== "undefined") {
                    data.onGoBackFocus()
                }
                break
            case "__goForward":
                if (typeof (data.onGoForwardFocus) !== "undefined") {
                    data.onGoForwardFocus()
                }
                break
        }
    })
    $('#_FileManager_').on('mousedown', (e) => {
        if ($(e.target).attr('class') !== "_labelRightClickSelection_" && $(e.target).attr('class') !== "_filesItemsElementSelected_" && $(e.target).parent().attr('class') !== "_filesItemsElementSelected_" && $(e.target).attr('class') !== "_fileItemStructureElement_" && $(e.target).attr('class') !== "__Item__FileManager__" && $(e.target).attr('class')?.split(' ')[1] !== "_fileElementStructure_") {
            setAllDefaultParameter({ renameElement: false, renameElementStructure: false })
            updateFilesItems(getFolderById(currentPath))
            updateFilesItemsStructure()
        }
    })

    return {

    }
}