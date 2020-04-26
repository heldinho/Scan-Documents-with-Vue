import $ from 'jquery'
import Dynamsoft from 'dwt'

let EnumDWT_ImageType = Dynamsoft.EnumDWT_ImageType
let EnumDWT_UploadDataFormat = Dynamsoft.EnumDWT_UploadDataFormat
let EnumDWT_ConvertMode = Dynamsoft.EnumDWT_ConvertMode

export default {
  name: 'dwt',
  data() {
    return {
      title: 'Using Dynamic Web TWAIN in Vue Project',
      DWObject: false,
      strTempStr: '',
      DWTSourceCount: 0,
      httpPort: 2018,
      httpServer: location.hostname,
      re: /^\d+$/,
      uploadUrl: '',
      _iLeft: 0,
      _iTop: 0,
      _iRight: 0,
      _iBottom: 0
    }
  },
  created() {
    Dynamsoft.WebTwainEnv.AutoLoad = false
    Dynamsoft.WebTwainEnv.Containers = [
      { ContainerId: 'dwtcontrolContainer', Width: '583px', Height: '513px' }
    ]
    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {
      this.Dynamsoft_OnReady()
    })
    /**
     * In order to use the full version, do the following
     * 1. Change Dynamsoft.WebTwainEnv.Trial to false
     * 2. Replace A-Valid-Product-Key with a full version key
     * 3. Change Dynamsoft.WebTwainEnv.ResourcesPath to point to the full version
     *    resource files that you obtain after purchasing a key
     */
    Dynamsoft.WebTwainEnv.Trial = true
    //Dynamsoft.WebTwainEnv.ProductKey = "A-Valid-Product-Key";
    Dynamsoft.WebTwainEnv.ProductKey =
      't0141cQMAACCG0RYaq6/crIMV/JeasnfXv3IDw4WHrIG1i57UR2yz+mIJxFHPd0KPR/VeuQLre6euCU2VfKVoSmcv+nGWYJAERq/MugsZzYKpzJHEaPTWshv/Y1b5+ZcEc2zGiXKjBeO5YZpHEf29Ic/8MVownhumeQqZj2ZopGC0YDw3xLVx8+Zm8gY1ma8m'
    //Dynamsoft.WebTwainEnv.ResourcesPath = "https://tst.dynamsoft.com/libs/dwt/15.0";
  },
  mounted() {
    this.pageOnLoad()

    let strhttp = 'http://'
    if ('https:' == document.location.protocol) strhttp = 'https://'
    this.uploadUrl = strhttp + this.httpServer + ':' + this.httpPort + '/upload'

    Dynamsoft.WebTwainEnv.Load()
  },
  methods: {
    pageOnLoad() {
      $('ul.PCollapse li>div').on('click', function() {
        if (
          $(this)
            .next()
            .css('display') == 'none'
        ) {
          $('.divType')
            .next()
            .hide('normal')
          $('.divType')
            .children('.mark_arrow')
            .removeClass('expanded')
          $('.divType')
            .children('.mark_arrow')
            .addClass('collapsed')
          $(this)
            .next()
            .show('normal')
          $(this)
            .children('.mark_arrow')
            .removeClass('collapsed')
          $(this)
            .children('.mark_arrow')
            .addClass('expanded')
        }
      })
      $('#imgTypetiff').on('click', function() {
        let _chkMultiPageTIFF = document.getElementById('MultiPageTIFF')
        _chkMultiPageTIFF.disabled = false
        _chkMultiPageTIFF.checked = false

        let _chkMultiPagePDF = document.getElementById('MultiPagePDF')
        _chkMultiPagePDF.checked = false
        _chkMultiPagePDF.disabled = true
      })

      $('#imgTypepdf').on('click', function() {
        let _chkMultiPageTIFF = document.getElementById('MultiPageTIFF')
        _chkMultiPageTIFF.checked = false
        _chkMultiPageTIFF.disabled = true

        let _chkMultiPagePDF = document.getElementById('MultiPagePDF')
        _chkMultiPagePDF.disabled = false
        _chkMultiPagePDF.checked = false
      })
      let commonFun = function() {
        let _chkMultiPageTIFF = document.getElementById('MultiPageTIFF')
        _chkMultiPageTIFF.checked = false
        _chkMultiPageTIFF.disabled = true

        let _chkMultiPagePDF = document.getElementById('MultiPagePDF')
        _chkMultiPagePDF.checked = false
        _chkMultiPagePDF.disabled = true
      }
      $('#imgTypejpeg').on('click', commonFun)
      $('#imgTypepng').on('click', commonFun)
      $('#imgTypebmp').on('click', commonFun)

      this.initMessageBody()
      this.initCustomScan()
      let twainsource = document.getElementById('source')
      if (typeof twainsource != 'undefined') {
        twainsource.options.length = 0
        twainsource.options.add(
          new Option('Looking for devices.Please wait.', '0')
        )
        twainsource.options[0].selected = true
      }

      this.initiateInputs()
      this.setDefaultValue()
    },

    initMessageBody() {
      let MessageBody = document.getElementById('divNoteMessage')
      if (typeof MessageBody != 'undefined') {
        let ObjString =
          "<div><p style='margin: 0; color: #444; font-family: OpenSans-Semibold, Arial, sans-serif, Verdana, Helvetica;'>Platform & Browser Support: </p>Internet Explorer 6 or above (32 bit/64 bit), any version of Chrome (32 bit/64 bit), any version of Firefox on Windows; Safari, Chrome and Firefox on Mac OS X 10.6 or later; Chrome and Firefox v27 or above (64 bit) on Ubuntu 10-16, Debian 8, or Fedora 19+"
        ObjString += '.</div>'
        MessageBody.style.display = ''
        MessageBody.innerHTML = ObjString
      }
    },

    initCustomScan() {
      let ObjString = ''
      ObjString +=
        "<ul id='divTwainType' style='list-style: none; margin:0; padding-left:0'> "
      ObjString += "<li style='margin-top: 3px;'>"
      ObjString +=
        "<label id ='lblShowUI' for = 'ShowUI' style='display: inline-block;margin: 0 15px 0 0;font-size: 12px;'><input type='checkbox' id='ShowUI' style='width: 15px;height: 15px;vertical-align: middle;' />Show UI&nbsp;</label>"
      ObjString +=
        "<label for = 'ADF' style='display: inline-block;margin: 0 15px 0 0;font-size: 12px;'><input type='checkbox' id='ADF' style='width: 15px;height: 15px;vertical-align: middle;' />AutoFeeder&nbsp;</label>"
      ObjString +=
        "<label for = 'Duplex' style='display: inline-block;margin: 0;font-size: 12px;'><input type='checkbox' id='Duplex' style='width: 15px;height: 15px;vertical-align: middle;'/>Duplex</label></li>"
      ObjString += "<li style='margin-top: 8px;'>Pixel Type:"
      ObjString +=
        "<label for='BW' style='display: inline-block;margin: 0 15px 0 5px;font-size: 12px;'><input type='radio' id='BW' name='PixelType' style='width: 15px;height: 15px;vertical-align: middle;'/>B&amp;W </label>"
      ObjString +=
        "<label for='Gray'style='display: inline-block;margin: 0 15px 0 0;font-size: 12px;'><input type='radio' id='Gray' name='PixelType' style='width: 15px;height: 15px;vertical-align: middle;'/>Gray</label>"
      ObjString +=
        "<label for='RGB'style='display: inline-block;margin: 0;font-size: 12px;'><input type='radio' id='RGB' name='PixelType' style='width: 15px;height: 15px;vertical-align: middle;'/>Color</label></li>"
      ObjString += "<li style='margin-top: 8px;'>"
      ObjString +=
        "<span>Resolution:</span><select size='1' id='Resolution' style='margin-left: 3px;width: 192px;height: 26px;'><option value = ''></option></select></li>"
      ObjString += '</ul>'

      if (document.getElementById('divProductDetail'))
        document.getElementById('divProductDetail').innerHTML = ObjString
      let vResolution = document.getElementById('Resolution')
      if (vResolution) {
        vResolution.options.length = 0
        vResolution.options.add(new Option('100', '100'))
        vResolution.options.add(new Option('150', '150'))
        vResolution.options.add(new Option('200', '200'))
        vResolution.options.add(new Option('300', '300'))
        vResolution.options[3].selected = true
      }
    },

    initiateInputs() {
      let allinputs = document.getElementsByTagName('input')
      for (let i = 0; i < allinputs.length; i++) {
        if (allinputs[i].type == 'checkbox') {
          allinputs[i].checked = false
        } else if (allinputs[i].type == 'text') {
          allinputs[i].value = ''
        }
      }
      if (Dynamsoft.Lib.env.bIE == true && Dynamsoft.Lib.env.bWin64 == true) {
        let o = document.getElementById('samplesource64bit')
        if (o) o.style.display = 'inline'

        o = document.getElementById('samplesource32bit')
        if (o) o.style.display = 'none'
      }
    },

    setDefaultValue() {
      let vGray = document.getElementById('Gray')
      if (vGray) vGray.checked = true

      let varImgTypepng2 = document.getElementById('imgTypepng2')
      if (varImgTypepng2) varImgTypepng2.checked = true
      let varImgTypepng = document.getElementById('imgTypepng')
      if (varImgTypepng) varImgTypepng.checked = true
      let _strDefaultSaveImageName = 'WebTWAINImage'
      let _txtFileNameforSave = document.getElementById('txt_fileNameforSave')
      if (_txtFileNameforSave)
        _txtFileNameforSave.value = _strDefaultSaveImageName
      let _txtFileName = document.getElementById('txt_fileName')
      if (_txtFileName) _txtFileName.value = _strDefaultSaveImageName
      let _chkMultiPageTIFF_save = document.getElementById('MultiPageTIFF_save')
      if (_chkMultiPageTIFF_save) _chkMultiPageTIFF_save.disabled = true
      let _chkMultiPagePDF_save = document.getElementById('MultiPagePDF_save')
      if (_chkMultiPagePDF_save) _chkMultiPagePDF_save.disabled = true
      let _chkMultiPageTIFF = document.getElementById('MultiPageTIFF')
      if (_chkMultiPageTIFF) _chkMultiPageTIFF.disabled = true
      let _chkMultiPagePDF = document.getElementById('MultiPagePDF')
      if (_chkMultiPagePDF) _chkMultiPagePDF.disabled = true
    },
    //
    // main entry for initializing dwt related settings
    //
    Dynamsoft_OnReady() {
      let liNoScanner = document.getElementById('pNoScanner')
      this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer')
      // If the ErrorCode is 0, it means everything is fine for the control. It is fully loaded.
      if (this.DWObject) {
        if (this.DWObject.ErrorCode == 0) {
          this.DWObject.LogLevel = 0
          this.DWObject.IfAllowLocalCache = true
          this.DWObject.ImageCaptureDriverType = 3
          this.DWObject.RegisterEvent(
            'OnMouseClick',
            this.Dynamsoft_OnMouseClick
          )
          this.DWObject.RegisterEvent(
            'OnTopImageInTheViewChanged',
            this.Dynamsoft_OnTopImageInTheViewChanged
          )
          let twainsource = document.getElementById('source')
          if (!twainsource) {
            twainsource = document.getElementById('webcamsource')
          }

          let vCount = this.DWObject.SourceCount
          this.DWTSourceCount = vCount
          let vTWAINCount = 0

          if (twainsource) {
            twainsource.options.length = 0
            for (let i = 0; i < vCount; i++) {
              if (Dynamsoft.Lib.env.bMac) {
                twainsource.options.add(
                  new Option(
                    'ICA_' + this.DWObject.GetSourceNameItems(i),
                    i.toString()
                  )
                )
              } else {
                twainsource.options.add(
                  new Option(this.DWObject.GetSourceNameItems(i), i.toString())
                )
              }
            }

            if (Dynamsoft.Lib.env.bMac) {
              this.DWObject.CloseSourceManager()
              this.DWObject.ImageCaptureDriverType = 0
              this.DWObject.OpenSourceManager()
              vTWAINCount = this.DWObject.SourceCount

              for (let j = vCount; j < vCount + vTWAINCount; j++) {
                twainsource.options.add(
                  new Option(
                    this.DWObject.GetSourceNameItems(j - vCount),
                    j.toString()
                  )
                )
              }
            }
          }

          // If source list need to be displayed, fill in the source items.
          if (vCount + vTWAINCount == 0) {
            if (liNoScanner) {
              if (Dynamsoft.Lib.env.bWin) {
                liNoScanner.style.display = 'block'
                liNoScanner.style.textAlign = 'center'
              } else liNoScanner.style.display = 'none'
            }
          }

          if (vCount + vTWAINCount > 0) {
            this.source_onchange()
          }

          if (Dynamsoft.Lib.env.bWin) this.DWObject.MouseShape = false

          let btnScan = document.getElementById('btnScan')
          if (btnScan) {
            if (vCount + vTWAINCount == 0) btnScan.disabled = true
            else {
              btnScan.disabled = false
              btnScan.style.color = '#fff'
              btnScan.style.backgroundColor = '#50a8e1'
              btnScan.style.cursor = 'pointer'
            }
          }

          if (!Dynamsoft.Lib.env.bWin && vCount > 0) {
            if (document.getElementById('lblShowUI'))
              document.getElementById('lblShowUI').style.display = 'none'
            if (document.getElementById('ShowUI'))
              document.getElementById('ShowUI').style.display = 'none'
          } else {
            if (document.getElementById('lblShowUI'))
              document.getElementById('lblShowUI').style.display = ''
            if (document.getElementById('ShowUI'))
              document.getElementById('ShowUI').style.display = ''
          }

          this.initDllForChangeImageSize()

          for (let i = 0; i < document.links.length; i++) {
            if (document.links[i].className == 'ShowtblLoadImage') {
              document.links[i].onclick = this.showtblLoadImage_onclick
            }
            if (document.links[i].className == 'ClosetblLoadImage') {
              document.links[i].onclick = this.closetblLoadImage_onclick
            }
          }
          if (vCount + vTWAINCount == 0) {
            if (Dynamsoft.Lib.env.bWin) {
              if (
                document.getElementById('aNoScanner') &&
                window['bDWTOnlineDemo']
              ) {
                if (
                  document.getElementById('div_ScanImage').style.display == ''
                )
                  this.showtblLoadImage_onclick()
              }
              if (document.getElementById('Resolution'))
                document.getElementById('Resolution').style.display = 'none'
            }
          } else {
            let divBlank = document.getElementById('divBlank')
            if (divBlank) divBlank.style.display = 'none'
          }
          this.updatePageInfo()

          this.DWObject.RegisterEvent(
            'OnPostTransfer',
            this.Dynamsoft_OnPostTransfer
          )
          this.DWObject.RegisterEvent(
            'OnPostLoad',
            this.Dynamsoft_OnPostLoadfunction
          )
          this.DWObject.RegisterEvent(
            'OnPostAllTransfers',
            this.Dynamsoft_OnPostAllTransfers
          )
          this.DWObject.RegisterEvent(
            'OnImageAreaSelected',
            this.Dynamsoft_OnImageAreaSelected
          )
          this.DWObject.RegisterEvent(
            'OnImageAreaDeSelected',
            this.Dynamsoft_OnImageAreaDeselected
          )
          this.DWObject.RegisterEvent(
            'OnGetFilePath',
            this.Dynamsoft_OnGetFilePath
          )
        }
      }
    },

    appendMessage(strMessage) {
      this.strTempStr += strMessage
      let _divMessageContainer = document.getElementById('DWTemessage')
      if (_divMessageContainer) {
        _divMessageContainer.innerHTML = this.strTempStr
        _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight
      }
    },
    clearmessages() {
      this.strTempStr = ''
      let _divMessageContainer = document.getElementById('DWTemessage')
      _divMessageContainer.innerHTML = this.strTempStr
    },
    checkIfImagesInBuffer() {
      if (this.DWObject.HowManyImagesInBuffer == 0) {
        this.appendMessage('Não há imagem no buffer.<br />')
        return false
      } else return true
    },
    checkErrorStringWithErrorCode(errorCode, errorString, responseString) {
      if (errorCode == 0) {
        this.appendMessage(
          "<span style='color:#cE5E04'><strong>" +
            errorString +
            '</strong></span><br />'
        )
        return true
      }
      if (errorCode == -2115)
        //Cancel file dialog
        return true
      else {
        if (errorCode == -2003) {
          let ErrorMessageWin = window.open(
            '',
            'ErrorMessage',
            'height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'
          )
          ErrorMessageWin.document.writeln(responseString)
        }
        this.appendMessage(
          "<span style='color:#cE5E04'><strong>" +
            errorString +
            '</strong></span><br />'
        )
        return false
      }
    },
    checkErrorString() {
      return this.checkErrorStringWithErrorCode(
        this.DWObject.ErrorCode,
        this.DWObject.ErrorString
      )
    },
    updatePageInfo() {
      let DW_TotalImage = document.getElementById('DW_TotalImage')
      let DW_CurrentImage = document.getElementById('DW_CurrentImage')
      if (DW_TotalImage)
        DW_TotalImage.value = this.DWObject.HowManyImagesInBuffer.toString()
      if (DW_CurrentImage)
        DW_CurrentImage.value = (
          this.DWObject.CurrentImageIndexInBuffer + 1
        ).toString()
    },

    Dynamsoft_OnTopImageInTheViewChanged(index) {
      this._iLeft = 0
      this._iTop = 0
      this._iRight = 0
      this._iBottom = 0
      this.DWObject.CurrentImageIndexInBuffer = index
      this.updatePageInfo()
    },
    Dynamsoft_OnImageAreaSelected(index, left, top, right, bottom) {
      this._iLeft = left
      this._iTop = top
      this._iRight = right
      this._iBottom = bottom
    },
    Dynamsoft_OnMouseClick(index) {
      this.updatePageInfo()
    },
    Dynamsoft_OnPostTransfer() {
      this.updatePageInfo()
    },

    Dynamsoft_OnPostLoadfunction(path, name, type) {
      this.updatePageInfo()
    },
    Dynamsoft_OnPostAllTransfers() {
      this.DWObject.CloseSource()
      this.updatePageInfo()
      this.checkErrorString()
    },
    Dynamsoft_OnMouseRightClick(index) {},
    Dynamsoft_OnImageAreaDeselected(index) {
      this._iLeft = 0
      this._iTop = 0
      this._iRight = 0
      this._iBottom = 0
    },
    Dynamsoft_OnMouseDoubleClick() {},
    Dynamsoft_OnGetFilePath(bSave, count, index, path, name) {},

    //
    // events for page elements
    //
    source_onchange() {
      if (document.getElementById('divTwainType'))
        document.getElementById('divTwainType').style.display = ''
      if (document.getElementById('source')) {
        let cIndex = document.getElementById('source').selectedIndex
        if (Dynamsoft.Lib.env.bMac) {
          if (cIndex >= this.DWTSourceCount) {
            if (document.getElementById('lblShowUI'))
              document.getElementById('lblShowUI').style.display = ''
            if (document.getElementById('ShowUI'))
              document.getElementById('ShowUI').style.display = ''
          } else {
            if (document.getElementById('lblShowUI'))
              document.getElementById('lblShowUI').style.display = 'none'
            if (document.getElementById('ShowUI'))
              document.getElementById('ShowUI').style.display = 'none'
          }
        } else if (this.DWObject) this.DWObject.SelectSourceByIndex(cIndex)
      }
    },
    initDllForChangeImageSize() {
      let vInterpolationMethod = document.getElementById('InterpolationMethod')
      vInterpolationMethod.options.length = 0
      vInterpolationMethod.options.add(new Option('NearestNeighbor', '1'))
      vInterpolationMethod.options.add(new Option('Bilinear', '2'))
      vInterpolationMethod.options.add(new Option('Bicubic', '3'))
    },
    showtblLoadImage_onclick() {
      switch (document.getElementById('tblLoadImage').style.visibility) {
        case 'hidden':
          document.getElementById('tblLoadImage').style.visibility = 'visible'
          document.getElementById('Resolution').style.visibility = 'hidden'
          break
        case 'visible':
          document.getElementById('tblLoadImage').style.visibility = 'hidden'
          document.getElementById('Resolution').style.visibility = 'visible'
          break
        default:
          break
      }
      return false
    },
    closetblLoadImage_onclick() {
      document.getElementById('tblLoadImage').style.visibility = 'hidden'
      document.getElementById('Resolution').style.visibility = 'visible'
      return false
    },

    //
    // edit features
    //
    btnShowImageEditor_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.ShowImageEditor()
    },
    btnRotateRight_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.RotateRight(this.DWObject.CurrentImageIndexInBuffer)
      this.appendMessage('<strong>Rotate right: </strong>')
      if (this.checkErrorString()) {
        return
      }
    },
    btnRotateLeft_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.RotateLeft(this.DWObject.CurrentImageIndexInBuffer)
      this.appendMessage('<strong>Rotate left: </strong>')
      if (this.checkErrorString()) {
        return
      }
    },
    btnRotate180_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, 180, true)
      this.appendMessage('<strong>Rotate 180: </strong>')
      if (this.checkErrorString()) {
        return
      }
    },
    btnMirror_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer)
      this.appendMessage('<strong>Mirror: </strong>')
      if (this.checkErrorString()) {
        return
      }
    },
    btnFlip_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer)
      this.appendMessage('<strong>Flip: </strong>')
      if (this.checkErrorString()) {
        return
      }
    },
    btnCrop_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      if (
        this._iLeft != 0 ||
        this._iTop != 0 ||
        this._iRight != 0 ||
        this._iBottom != 0
      ) {
        this.DWObject.Crop(
          this.DWObject.CurrentImageIndexInBuffer,
          this._iLeft,
          this._iTop,
          this._iRight,
          this._iBottom
        )
        this._iLeft = 0
        this._iTop = 0
        this._iRight = 0
        this._iBottom = 0
        this.appendMessage('<strong>Crop: </strong>')
        if (this.checkErrorString()) {
          return
        }
        return
      } else {
        this.appendMessage(
          "<strong>Crop: </strong>failed. Please first select the area you'd like to crop.<br />"
        )
      }
    },
    btnChangeImageSize_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      switch (document.getElementById('ImgSizeEditor').style.visibility) {
        case 'visible':
          document.getElementById('ImgSizeEditor').style.visibility = 'hidden'
          break
        case 'hidden':
          document.getElementById('ImgSizeEditor').style.visibility = 'visible'
          break
        default:
          break
      }
      let iWidth = this.DWObject.GetImageWidth(
        this.DWObject.CurrentImageIndexInBuffer
      )
      if (iWidth != -1)
        document.getElementById('img_width').value = iWidth.toString()
      let iHeight = this.DWObject.GetImageHeight(
        this.DWObject.CurrentImageIndexInBuffer
      )
      if (iHeight != -1)
        document.getElementById('img_height').value = iHeight.toString()
    },
    btnCancelChange_onclick() {
      document.getElementById('ImgSizeEditor').style.visibility = 'hidden'
    },
    btnChangeImageSizeOK_onclick() {
      document.getElementById('img_height').className = ''
      document.getElementById('img_width').className = ''
      if (!this.re.test(document.getElementById('img_height').value)) {
        document.getElementById('img_height').className += ' invalid'
        document.getElementById('img_height').focus()
        this.appendMessage(
          'Please input a valid <strong>height</strong>.<br />'
        )
        return
      }
      if (!this.re.test(document.getElementById('img_width').value)) {
        document.getElementById('img_width').className += ' invalid'
        document.getElementById('img_width').focus()
        this.appendMessage('Please input a valid <strong>width</strong>.<br />')
        return
      }
      this.DWObject.ChangeImageSize(
        this.DWObject.CurrentImageIndexInBuffer,
        parseInt(document.getElementById('img_width').value),
        parseInt(document.getElementById('img_height').value),
        document.getElementById('InterpolationMethod').selectedIndex + 1
      )
      this.appendMessage('<strong>Change Image Size: </strong>')
      if (this.checkErrorString()) {
        document.getElementById('ImgSizeEditor').style.visibility = 'hidden'
        return
      }
    },

    //
    // navigation
    //
    btnFirstImage_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.CurrentImageIndexInBuffer = 0
      this.updatePageInfo()
    },

    btnPreImage_wheel() {
      if (this.DWObject.HowManyImagesInBuffer != 0) this.btnPreImage_onclick()
    },

    btnNextImage_wheel() {
      if (this.DWObject.HowManyImagesInBuffer != 0) this.btnNextImage_onclick()
    },

    btnPreImage_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      } else if (this.DWObject.CurrentImageIndexInBuffer == 0) {
        return
      }
      this.DWObject.CurrentImageIndexInBuffer =
        this.DWObject.CurrentImageIndexInBuffer - 1
      this.updatePageInfo()
    },
    btnNextImage_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      } else if (
        this.DWObject.CurrentImageIndexInBuffer ==
        this.DWObject.HowManyImagesInBuffer - 1
      ) {
        return
      }
      this.DWObject.CurrentImageIndexInBuffer =
        this.DWObject.CurrentImageIndexInBuffer + 1
      this.updatePageInfo()
    },
    btnLastImage_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.CurrentImageIndexInBuffer =
        this.DWObject.HowManyImagesInBuffer - 1
      this.updatePageInfo()
    },
    btnRemoveCurrentImage_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.RemoveAllSelectedImages()
      if (this.DWObject.HowManyImagesInBuffer == 0) {
        document.getElementById(
          'DW_TotalImage'
        ).value = this.DWObject.HowManyImagesInBuffer.toString()
        document.getElementById('DW_CurrentImage').value = ''
        return
      } else {
        this.updatePageInfo()
      }
    },
    btnRemoveAllImages_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      this.DWObject.RemoveAllImages()
      document.getElementById('DW_TotalImage').value = '0'
      document.getElementById('DW_CurrentImage').value = ''
    },
    setlPreviewMode() {
      let varNum = document.getElementById('DW_PreviewMode').selectedIndex + 1
      let btnCrop = document.getElementById('btnCrop')
      if (btnCrop) {
        let tmpstr = btnCrop.src
        if (varNum > 1) {
          tmpstr = tmpstr.replace('Crop.', 'Crop_gray.')
          btnCrop.src = tmpstr
          btnCrop.onclick = () => {}
        } else {
          tmpstr = tmpstr.replace('Crop_gray.', 'Crop.')
          btnCrop.src = tmpstr
          btnCrop.onclick = () => {
            this.btnCrop_onclick()
          }
        }
      }

      this.DWObject.SetViewMode(varNum, varNum)
      if (Dynamsoft.Lib.env.bMac || Dynamsoft.Lib.env.bLinux) {
        return
      } else if (document.getElementById('DW_PreviewMode').selectedIndex != 0) {
        this.DWObject.MouseShape = true
      } else {
        this.DWObject.MouseShape = false
      }
    },

    //
    // save image
    //
    saveUploadImage(type) {
      if (type == 'local') {
        this.btnSave_onclick()
      } else if (type == 'server') {
        this.btnUpload_onclick()
      }
    },
    btnSave_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      let i, strimgType_save
      let NM_imgType_save = document.getElementsByName('ImageType')
      for (i = 0; i < 5; i++) {
        let el = NM_imgType_save.item(i)
        if (el['checked'] == true) {
          strimgType_save = el['value']
          break
        }
      }
      this.DWObject.IfShowFileDialog = true
      let _txtFileNameforSave = document.getElementById('txt_fileName')
      if (_txtFileNameforSave) _txtFileNameforSave.className = ''
      let bSave = false

      let strFilePath = _txtFileNameforSave.value + '.' + strimgType_save

      let OnSuccess = () => {
        this.appendMessage('<strong>Save Image: </strong>')
        this.checkErrorStringWithErrorCode(0, 'Successful.')
      }

      let OnFailure = (errorCode, errorString) => {
        this.checkErrorStringWithErrorCode(errorCode, errorString)
      }

      let _chkMultiPageTIFF_save = document.getElementById('MultiPageTIFF')
      let _chkMultiPagePDF_save = document.getElementById('MultiPagePDF')
      let vAsyn = false
      if (
        strimgType_save == 'tif' &&
        _chkMultiPageTIFF_save &&
        _chkMultiPageTIFF_save.checked
      ) {
        vAsyn = true
        if (
          this.DWObject.SelectedImagesCount == 1 ||
          this.DWObject.SelectedImagesCount ==
            this.DWObject.HowManyImagesInBuffer
        ) {
          bSave = this.DWObject.SaveAllAsMultiPageTIFF(
            strFilePath,
            OnSuccess,
            OnFailure
          )
        } else {
          bSave = this.DWObject.SaveSelectedImagesAsMultiPageTIFF(
            strFilePath,
            OnSuccess,
            OnFailure
          )
        }
      } else if (strimgType_save == 'pdf' && _chkMultiPagePDF_save.checked) {
        vAsyn = true
        if (
          this.DWObject.SelectedImagesCount == 1 ||
          this.DWObject.SelectedImagesCount ==
            this.DWObject.HowManyImagesInBuffer
        ) {
          bSave = this.DWObject.SaveAllAsPDF(strFilePath, OnSuccess, OnFailure)
        } else {
          bSave = this.DWObject.SaveSelectedImagesAsMultiPagePDF(
            strFilePath,
            OnSuccess,
            OnFailure
          )
        }
      } else {
        switch (i) {
          case 0:
            bSave = this.DWObject.SaveAsBMP(
              strFilePath,
              this.DWObject.CurrentImageIndexInBuffer
            )
            break
          case 1:
            bSave = this.DWObject.SaveAsJPEG(
              strFilePath,
              this.DWObject.CurrentImageIndexInBuffer
            )
            break
          case 2:
            bSave = this.DWObject.SaveAsTIFF(
              strFilePath,
              this.DWObject.CurrentImageIndexInBuffer
            )
            break
          case 3:
            bSave = this.DWObject.SaveAsPNG(
              strFilePath,
              this.DWObject.CurrentImageIndexInBuffer
            )
            break
          case 4:
            bSave = this.DWObject.SaveAsPDF(
              strFilePath,
              this.DWObject.CurrentImageIndexInBuffer
            )
            break
        }
      }

      if (vAsyn == false) {
        if (bSave) this.appendMessage('<strong>Save Image: </strong>')
        if (this.checkErrorString()) {
          return
        }
      }
    },

    //
    // upload
    //
    btnUpload_onclick() {
      if (!this.checkIfImagesInBuffer()) {
        return
      }
      let i, strImageType

      let _txtFileName = document.getElementById('txt_fileName')
      if (_txtFileName) _txtFileName.className = ''
      let imageType = document.getElementsByName('ImageType')
      for (i = 0; i < 5; i++) {
        if (imageType.item(i)['checked'] == true) {
          strImageType = i
          break
        }
      }

      let fileName = _txtFileName.value
      let replaceStr = '<'
      fileName = fileName.replace(new RegExp(replaceStr, 'gm'), '&lt;')
      let uploadfilename =
        fileName + '.' + imageType.item(strImageType)['value']

      let _chkMultiPageTIFF_save = document.getElementById('MultiPageTIFF')
      let _chkMultiPagePDF_save = document.getElementById('MultiPagePDF')
      let _aryIndicesToUpload = []
      let _EnumDWT_ImageTypeToUpload = EnumDWT_ImageType.IT_JPG
      if (strImageType == 2 && _chkMultiPageTIFF_save.checked) {
        _EnumDWT_ImageTypeToUpload = EnumDWT_ImageType.IT_TIF
        if (
          this.DWObject.SelectedImagesCount == 1 ||
          this.DWObject.SelectedImagesCount ==
            this.DWObject.HowManyImagesInBuffer
        ) {
          for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++)
            _aryIndicesToUpload.push(i)
        } else {
          for (let i = 0; i < this.DWObject.SelectedImagesCount; i++)
            _aryIndicesToUpload.push(this.DWObject.GetSelectedImageIndex(i))
        }
      } else if (strImageType == 4 && _chkMultiPagePDF_save.checked) {
        _EnumDWT_ImageTypeToUpload = EnumDWT_ImageType.IT_PDF
        if (
          this.DWObject.SelectedImagesCount == 1 ||
          this.DWObject.SelectedImagesCount ==
            this.DWObject.HowManyImagesInBuffer
        ) {
          for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++)
            _aryIndicesToUpload.push(i)
        } else {
          for (let i = 0; i < this.DWObject.SelectedImagesCount; i++)
            _aryIndicesToUpload.push(this.DWObject.GetSelectedImageIndex(i))
        }
      } else {
        _EnumDWT_ImageTypeToUpload = strImageType

        _aryIndicesToUpload.push(this.DWObject.CurrentImageIndexInBuffer)
      }

      //
      // the upload method is called here
      //
      this.DWObject.ClearAllHTTPFormField()
      this.DWObject.SetHTTPFormField('filename', uploadfilename)
      this.DWObject.HTTPUpload(
        this.uploadUrl,
        _aryIndicesToUpload,
        _EnumDWT_ImageTypeToUpload,
        EnumDWT_UploadDataFormat.Binary,
        () => {
          if (
            this.DWObject.SelectedImagesCount ==
            this.DWObject.HowManyImagesInBuffer
          )
            this.DWObject.SelectedImagesCount = 1
          this.appendMessage(
            uploadfilename +
              ' was <strong>uploaded successfully!</strong><br />'
          )
        },
        (errcode, errstr, httppostresponsestring) => {
          this.checkErrorStringWithErrorCode(
            errcode,
            errstr,
            httppostresponsestring
          )
        }
      )
    },

    //
    // Acquire Image
    //
    acquireImage() {
      let cIndex = document.getElementById('source').selectedIndex
      if (cIndex < 0) return
      if (Dynamsoft.Lib.env.bMac) {
        this.DWObject.CloseSourceManager()
        this.DWObject.ImageCaptureDriverType = 3
        this.DWObject.OpenSourceManager()
        if (cIndex >= this.DWTSourceCount) {
          cIndex = cIndex - this.DWTSourceCount
          this.DWObject.CloseSourceManager()
          this.DWObject.ImageCaptureDriverType = 0
          this.DWObject.OpenSourceManager()
        }
      }

      this.DWObject.SelectSourceByIndex(cIndex)
      this.DWObject.CloseSource()
      this.DWObject.OpenSource()
      this.DWObject.IfShowUI = document.getElementById('ShowUI').checked

      let i
      for (i = 0; i < 3; i++) {
        if (document.getElementsByName('PixelType').item(i).checked == true)
          this.DWObject.PixelType = i
      }
      if (this.DWObject.ErrorCode != 0) {
        this.appendMessage('<strong>Error setting PixelType value: </strong>')
        this.appendMessage(
          "<span style='color:#cE5E04'><strong>" +
            this.DWObject.ErrorString +
            '</strong></span><br />'
        )
      }
      this.DWObject.Resolution = parseInt(
        document.getElementById('Resolution').value
      )
      if (this.DWObject.ErrorCode != 0) {
        this.appendMessage('<strong>Error setting Resolution value: </strong>')
        this.appendMessage(
          "<span style='color:#cE5E04'><strong>" +
            this.DWObject.ErrorString +
            '</strong></span><br />'
        )
      }

      let bADFChecked = document.getElementById('ADF').checked
      this.DWObject.IfFeederEnabled = bADFChecked
      if (bADFChecked == true && this.DWObject.ErrorCode != 0) {
        this.appendMessage('<strong>Error setting ADF value: </strong>')
        this.appendMessage(
          "<span style='color:#cE5E04'><strong>" +
            this.DWObject.ErrorString +
            '</strong></span><br />'
        )
      }

      let bDuplexChecked = document.getElementById('Duplex').checked
      this.DWObject.IfDuplexEnabled = bDuplexChecked
      if (bDuplexChecked == true && this.DWObject.ErrorCode != 0) {
        this.appendMessage('<strong>Error setting Duplex value: </strong>')
        this.appendMessage(
          "<span style='color:#cE5E04'><strong>" +
            this.DWObject.ErrorString +
            '</strong></span><br />'
        )
      }
      if (
        Dynamsoft.Lib.env.bWin ||
        (!Dynamsoft.Lib.env.bWin && this.DWObject.ImageCaptureDriverType == 0)
      )
        this.appendMessage(
          'Pixel Type: ' +
            this.DWObject.PixelType +
            '<br />Resolution: ' +
            this.DWObject.Resolution +
            '<br />'
        )
      this.DWObject.IfDisableSourceAfterAcquire = true
      this.DWObject.AcquireImage()
    },

    //
    // load image
    //
    btnLoadImagesOrPDFs_onclick() {
      let OnPDFSuccess = () => {
        this.appendMessage('Loaded an image successfully.<br/>')
        this.updatePageInfo()
      }

      let OnPDFFailure = (errorCode, errorString) => {
        this.checkErrorStringWithErrorCode(errorCode, errorString)
      }

      this.DWObject.IfSSL = Dynamsoft.Lib.detect.ssl
      let _strPort = location.port == '' ? 80 : location.port
      if (Dynamsoft.Lib.detect.ssl == true)
        _strPort = location.port == '' ? 443 : location.port
      this.DWObject.HTTPPort = _strPort

      this.DWObject.IfShowFileDialog = true
      this.DWObject.Addon.PDF.SetResolution(200)
      this.DWObject.Addon.PDF.SetConvertMode(EnumDWT_ConvertMode.CM_RENDERALL)
      this.DWObject.LoadImageEx(
        '',
        EnumDWT_ImageType.IT_ALL,
        OnPDFSuccess,
        OnPDFFailure
      )
    }
  }
}
