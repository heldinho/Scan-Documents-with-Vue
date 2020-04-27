angular.module('clouddocApp').controller('ecmScanningCtrl', [
  'docsService',
  'dbSearch',
  'sessionData',
  '$rootScope',
  '$scope',
  'useTranslate',
  '$translate',
  '$timeout',
  '$stateParams',
  'notification',
  'AddTranslateVars',
  'variablesConfig',
  'Files',
  'registerDB',
  'utils',
  '$cookieStore',
  '$ocLazyLoad',
  '$state',
  '$http',
  '$compile',
  function(
    docsService,
    dbSearch,
    sessionData,
    $rootScope,
    $scope,
    useTranslate,
    $translate,
    $timeout,
    $stateParams,
    notification,
    AddTranslateVars,
    variablesConfig,
    Files,
    registerDB,
    utils,
    $cookieStore,
    $ocLazyLoad,
    $state,
    $http,
    $compile
  ) {
    /*==Selectize Config==*/
    if (variablesConfig.hostV2 === '/api/v2') {
      var httpURL = window.location.origin + variablesConfig.hostV2
    } else {
      var httpURL = variablesConfig.hostV2
    }
    var camera
    var ReloadPage = true
    var $modalSaveScanning,
      currentImage = 0,
      scannerLoaded = 0
    var hardwarePageBlank = false

    $scope.addRemovePages = function(boolean) {
      $scope.border = boolean

      $timeout(function() {
        //Se o scanner suportar usa as configurações do driver
        if (boolean === true) {
          DWObject.IfAutoDiscardBlankpages = true
          DWObject.Capability = EnumDWT_Cap.ICAP_AUTODISCARDBLANKPAGES
          DWObject.CapType = EnumDWT_CapType.TWON_ONEVALUE
          DWObject.CapValue = -1 //Auto
          if (DWObject.CapSet) {
            hardwarePageBlank = true
          } else {
            hardwarePageBlank = false
          }
        } else {
          DWObject.IfAutoDiscardBlankpages = false
          hardwarePageBlank = false
        }
      })
    }

    /*==Inicia os checkbox==*/
    $scope.adf = false
    $scope.lbl = false
    $scope.duplex = false
    $scope.border = false
    $scope.remove_pages_blank = false
    $scope.activeWebcam = false
    $scope.activeImage = false
    $scope.imageBufferCount = 0
    $scope.imageSaveCount = 0
    $scope.showBtnSave = false
    $scope.saveAllFiles = false
    $scope.selectize_all_scanupload_all = ''
    $scope.property_blank = 1
    var uploadError = []

    var $load_scanning_progress

    $rootScope.toolbarActive = true

    var currentImage = 0

    var DWObject, DWObjectLargeViewer // = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');

    function setConfigSelectize(placeholder) {
      var configTPL = {
        create: false,
        maxItems: 1,
        placeholder: placeholder,
        valueField: 'value',
        labelField: 'title'
      }
      return configTPL
    }

    $scope.viewImageLitebox = function(evt) {
      var height = $(document).height()
      $scope.heightImageLightbox = height + 'px'
      $scope.lightboxUrl = evt.currentTarget.src
      var modalLightBox = UIkit.modal('#modal-lightbox-scan')
      modalLightBox.show()
    }

    $scope.selectize_scanres_config = setConfigSelectize('RESOLUTION')
    $scope.selectize_scantype_config = setConfigSelectize('COLOR_SETTING')
    $scope.selectize_scanupload_config = setConfigSelectize('FILE_TYPE')
    $scope.selectize_scansource_config = setConfigSelectize('SCANNING')
    $scope.selectize_scanupload_all_config = setConfigSelectize('SELECT')
    $scope.selectize_camsource_config = setConfigSelectize('CANSOURCE')

    function setScantypeOptions() {
      $scope.selectize_scantype_options = [
        { title: $scope.COLORFUL, value: '2' },
        { title: $scope.BLACK_AND_WHITE, value: '0' },
        { title: $scope.GRAY_SCALE, value: '1' }
      ]
    }
    var doc = $stateParams.docsId
    //var uploadAction = ['/ecm/templates/', tpl, '/documents/', doc, '/files/upload', '?token=', $rootScope.currentUser.jwt].join("");

    //Options
    $scope.file_name = {}
    $scope.selectize_scanupload = {}

    $scope.filesName = []

    $scope.selectize_scansource_options = []
    $scope.selectize_scanres_options = [
      { title: '100 DPI', value: '100' },
      { title: '150 DPI', value: '150' },
      { title: '200 DPI', value: '200' },
      { title: '250 DPI', value: '250' },
      { title: '300 DPI', value: '300' },
      { title: '350 DPI', value: '350' },
      {
        title: '400 DPI',
        value: '400'
      } /*,
                {title: "450 DPI", value: "450"},
                {title: "500 DPI", value: "500"},
                {title: "550 DPI", value: "550"},
                {title: "600 DPI", value: "600"}*/
    ]
    $scope.selectize_camsource_options = []
    $scope.selectize_scantype_options = []
    $scope.selectize_scanupload_options = [
      { title: 'TIFF', value: 'tiff' },
      { title: 'PNG', value: 'png' },
      { title: 'PDF', value: 'pdf' }
    ]
    $scope.selectize_camsource_options = []

    //Callback functions for async APIs
    function OnSuccess() {
      console.log('successful')
    }

    function OnFailure(errorCode, errorString) {
      alert(errorString)
    }

    //Faz upload de imagens
    function LoadImage() {
      if (DWObject) {
        DWObject.SetViewMode(1, 2)
        DWObject.IfShowFileDialog = true // Open the system's file dialog to load image
        DWObject.LoadImageEx('', EnumDWT_ImageType.IT_ALL, OnSuccess, OnFailure) // Load images in all supported formats (.bmp, .jpg, .tif, .png, .pdf). OnSuccess or OnFailure will be called after the operation
      }
    }

    $scope.AcquireImage = function() {
      DWObject.IfShowUI = getModelVal('lbl') ? true : false

      DWObject.SetViewMode(1, 2)

      DWObject.IfDisableSourceAfterAcquire = true

      DWObject.SelectSourceByIndex(getModelVal('selectize_scansource'))

      DWObject.OpenSource()

      // NEEDS TO BE AFTER OpenSource and  BEFORE AquireImage
      DWObject.Resolution = getModelVal('selectize_scanres')
      DWObject.PixelType = getModelVal('selectize_scantype')

      DWObject.IfFeederEnabled = getModelVal('adf') ? true : false

      DWObject.IfDuplexEnabled = getModelVal('duplex') ? true : false
      DWObject.IfAutomaticBorderDetection = getModelVal('border') ? true : false

      scannerLoaded = 1

      DWObject.AcquireImage(loadThumb)
    } // AquireImage

    //Botão salvar
    $scope.SelectFileType = function(documento) {
      /*==Inicia modais==*/
      $modalSaveScanning = UIkit.modal('#modalSaveScanning', {
        modal: false,
        bgclose: false
      })
      $timeout(function() {
        if (!DWObject && DWObject.HowManyImagesInBuffer > 0) {
          notification.msg({
            message: $scope['NO_FILES'],
            status: 'danger',
            timeout: '1000'
          })
          return
        }

        //Create vetor name images
        function createVt(qtd) {
          $scope.file_name = {}
          $scope.selectize_scanupload = {}

          //Exibe os botões para salvar mais de uma imagem
          $scope.saveAllFiles = qtd > 1
          var i = 0
          for (i; i < qtd; i++) {
            $scope.file_name[i] = [
              $scope.FILE.toLowerCase(),
              '-',
              moment().format('DD-MM-YYYY-h-mm-ss'),
              i
            ].join('')
            $scope.selectize_scanupload[i] =
              $scope.selectize_all_scanupload_all || 'tiff'
          }

          $scope.totalFileUpload = i

          $timeout(function() {
            $scope.imageBufferCount = i
            $modalSaveScanning.show()

            function addRecursiveImageInModal(indice) {
              function asyncSuccessFunc(result) {
                var length = result.getLength()
                var img = $('#thumbnail-modal-' + indice)
                img
                  .one('load', function() {
                    img.parent().removeClass('scan-thumbnail-loading')
                  })
                  .each(function() {
                    if (this.complete) $(this).load()
                  })
                img.attr(
                  'src',
                  'data:image/png;base64,' + result.getData(0, length)
                )

                if (indice < qtd - 1) {
                  addRecursiveImageInModal((indice += 1))
                }
              }

              function asyncFailureFunc(errorCode, errorString) {
                console.log(
                  'ErrorCode: ' +
                    errorCode +
                    '\r' +
                    'ErrorString:' +
                    errorString
                )
              }

              DWObject.ConvertToBase64(
                [indice],
                EnumDWT_ImageType.IT_PNG,
                asyncSuccessFunc,
                asyncFailureFunc
              )
            }

            addRecursiveImageInModal(0)
          }, 500)
        }

        createVt(DWObject.HowManyImagesInBuffer)
      })
    }

    $scope.getParamSize = function(type) {
      var obj = {
        bmp: 'IT_BMP',
        // 'jpg': 'IT_JPG',
        tiff: 'IT_TIF',
        png: 'IT_PNG',
        pdf: 'IT_PDF'
      }
      return obj[type]
    }

    //Salva a imagem com a Extensão selecionada
    $scope.saveImages = function() {
      var modalBlock = UIkit.modal.blockUI(
        [
          utils.getImageLoader($scope.LOAD_SAVE_INFO),
          '<div class="uk-progress uk-progress-striped uk-active">',
          '<div class="uk-progress-bar" id="load-scanning-progress"></div></div>'
        ].join('')
      )
      modalBlock.show()
      //Delay modal open
      $timeout(function() {
        $load_scanning_progress = $('#load-scanning-progress')
        $load_scanning_progress.css('width', '5%')
        $load_scanning_progress.html('5%')

        if (DWObject && DWObject.HowManyImagesInBuffer == 1) {
          // If no image in buffer, return the function
          if (DWObject.HowManyImagesInBuffer == 0) {
            notification.msg({
              message: $scope.SELECT_A_FILE,
              status: 'danger',
              timeout: '1000'
            })
          }

          $load_scanning_progress.html('50%')
          $load_scanning_progress.css('width', '50%')

          // Uses milliseconds according to local time as the file name

          // Set extra info as HTTP form fields to be sent to the server together with the images
          DWObject.ClearAllHTTPFormField()
          DWObject.SetHTTPFormField('scanner', true)

          var saveOp = $scope.selectize_scanupload[0]

          // Pre-calculate the size of the images:
          DWObject.GetSelectedImagesSize(
            EnumDWT_ImageType[$scope.getParamSize(saveOp)]
          )

          var fileName = getFileName(0) + '.' + saveOp

          var fnSuccess = function(errorCode, errorString, sHttpResponse) {
            $load_scanning_progress.html('100%')
            $load_scanning_progress.css('width', '100%')
            $timeout(function() {
              if (!isJson(sHttpResponse)) {
                notification.msg({
                  message: [$scope.SCANNER_UPLOAD_ERROR, fileName].join(''),
                  status: 'danger',
                  timeout: '1000'
                })
              } else {
                notification.msg({
                  message: $scope.UPLOAD_SUCCESS,
                  status: 'success',
                  timeout: '1000'
                })
                $modalSaveScanning.hide()
                resetDraw()
              }
              modalBlock.hide()
            }, 1000)
          }

          //Adiciona o token aqui caso expire resgata sempre o token atualizado
          utils.getToken({
            success: function(userData) {
              var uploadAction = [
                '/ecm/documents/',
                doc,
                '/files/upload',
                '?token=',
                $rootScope.currentUser.jwt
              ].join('')
              DWObject.HTTPUploadThroughPost(
                httpURL,
                DWObject.CurrentImageIndexInBuffer,
                uploadAction,
                fileName,
                fnSuccess,
                fnSuccess
              )
            }
          })
        } else if (DWObject && DWObject.HowManyImagesInBuffer > 1) {
          //$scope.saveImageAll();
          $scope.saveAllImage(modalBlock)
        } else {
          notification.msg({
            message: $scope.SELECT_A_FILE,
            status: 'danger',
            timeout: '1000'
          })
        }
      }, 1000)
    }

    $scope.editImage = function() {
      if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
        DWObject.ShowImageEditor()
        DWObjectLargeViewer.RemoveAllImages()
      }
    }

    $scope.deleteImage = function() {
      if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
        DWObject.RemoveImage(currentImage)
        DWObjectLargeViewer.RemoveAllImages()
        $thumb = $('.dynamsoft-dwt-container-box > div > div')
        if ($thumb.length == 0) {
          $scope.showBtnSave = false
        }
      }
    }

    $scope.moveImage = function(direction) {
      if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
        var count = DWObject.HowManyImagesInBuffer
        console.log('total images: ', count)
        if (currentImage == 0 && direction == 'up')
          return console.log('image already on top')
        else if (currentImage == count - 1 && direction == 'down')
          return console.log('image already on bottom')

        var dir = 0
        if (direction == 'up') dir = -1
        else if (direction == 'down') dir = 1
        currentImage = currentImage + dir

        DWObject.MoveImage(currentImage, currentImage)

        clickThumb(currentImage)
      } else {
        console.log('O indice não foi definido')
      }
    }

    $scope.zoomImage = function(type) {
      // NOT WORKING
      if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
        console.log(DWObjectLargeViewer.Zoom)
        DWObjectLargeViewer.SetViewMode(-1, -1)

        if (type == 'minus')
          DWObjectLargeViewer.Zoom = DWObjectLargeViewer.Zoom * 0.9
        else DWObjectLargeViewer.Zoom = DWObjectLargeViewer.Zoom * 1.1
      }
    } // zoomImage

    $scope.rotateImage = function(side) {
      if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
        console.log('fired')

        if (side == 'right') DWObject.RotateRight(currentImage)
        else if (side == 'left') DWObject.RotateLeft(currentImage)
        else if (side == '180') DWObject.Rotate(currentImage, 180, false)
        else if (side == 'mirror') DWObject.Mirror(currentImage)
        else if (side == 'flip') DWObject.Flip(currentImage)

        // loadImage to large container
        loadThumb(currentImage)
      }
    } // rotateImage

    /*::::::::::::::::WEBCAM::::::::::::::::*/
    var snapshots = []
    var errorsWebcamUpload = []

    $scope.saveImgWebcam = function() {
      errorsWebcamUpload = []

      function recursiveSave(key, vt) {
        utils.getToken({
          success: function(userData) {
            var uploadAction = [
              '/ecm/templates/',
              tpl,
              '/documents/',
              doc,
              '/files/upload',
              '?token=',
              userData.jwt
            ].join('')
            var urlUpload = httpURL + uploadAction
            var index = vt[key]

            snapshots[index].get_blob(function(dataBlob) {
              var fd = new FormData()

              var $currentSnapCard = $('#box-webcam-' + index)

              $currentSnapCard.addClass('upload-start')

              var file_name = $('#input-text-file-webcam-' + index).prop(
                'value'
              )

              fd.append(
                'file',
                dataBlob,
                file_name.replace(/\s/g, '_') + '.jpg'
              )

              $http
                .post(urlUpload, fd, {
                  transformRequest: angular.identity,
                  headers: { 'Content-Type': undefined }
                })
                .then(
                  function(response) {
                    //ÚLTIMO UPLOAD

                    notification.msg({
                      message: [$scope.SUCCESS, '<br>', file_name].join(''),
                      status: 'success',
                      timeout: '1000'
                    })

                    $currentSnapCard.removeClass('upload-start')
                    $currentSnapCard.remove()

                    if (key < vt.length - 1) {
                      recursiveSave((key += 1), vt)
                    } else {
                      if (
                        errorsWebcamUpload.length === 0 &&
                        $('.scan-check-snapshot:checked').length === 0
                      ) {
                        snapshots = []
                      } else {
                      }
                    }
                  },
                  function(error) {
                    notification.msg({
                      message: [$scope.UPLOAD_ERROR, '<br>', file_name].join(
                        ''
                      ),
                      status: 'warning',
                      timeout: '1000'
                    })
                    $currentSnapCard.removeClass('upload-start')
                    errorsWebcamUpload.push(index)
                    if (key < vt.length - 1) {
                      recursiveSave((key += 1), vt)
                    }
                  }
                )
            })
          }
        })
      }

      var vtChecked = []

      //Pega todos os indices selecionados
      $('.scan-check-snapshot:checked').each(function() {
        vtChecked.push(parseInt($(this).prop('value')))
      })
      if (vtChecked.length > 0) recursiveSave(0, vtChecked)
    }

    $scope.downloadImgWebCam = function() {
      snapshots.push(camera.capture())
      var index = snapshots.length - 1

      var add_snapshot = function(element) {
        $(element)
          .data('snapshot', this)
          .addClass('item')

        var file_name = [
          'img-webcam',
          '-',
          moment().format('DD-MM-YYYY-h-mm-ss'),
          '-',
          index
        ].join('')
        var input = [
          '<input type="text" value="',
          file_name,
          '" class="md-input" id="input-text-file-webcam-',
          index,
          '"/>'
        ].join('')

        var $snapdiv = [
          '<div class="',
          index === 0 ? 'row-first' : '',
          ' box-webcam-item" id="box-webcam-',
          index,
          '"><div class="md-card md-card-hover md-card-overlay md-card-overlay-active toolbar-fixed snap-card" style="margin-bottom: 25px">',
          '<div class="md-card-toolbar">',
          '<div class="md-card-toolbar-actions">',
          '<input type="checkbox" value="',
          index,
          '" name="',
          index,
          '" id="check-modal-snapshot-',
          index,
          '" class="scan-check-snapshot" checked />',
          '<i class="btn-remove-snapshot material-icons uk-text-danger" id="btn-remove-snaphot-',
          index,
          '" style="margin-top:-6px;cursor:pointer">&#xE872;</i>',
          '</div>',
          '<h3 class="md-card-toolbar-heading-text">',
          input,
          '</h3>',
          '</div>',
          '<div class="md-card-content" style="height:225px"><i class="spinner-scan uk-icon-spinner uk-icon-medium uk-icon-spin"></i>',
          '</div>',
          '</div></div>'
        ].join('')

        var $snapdivC = $($snapdiv)
        $snapdivC.find('.md-card-content').each(function() {
          $(this).append(element)
        })
        $('#snapshots').append($snapdivC)

        $('#check-modal-snapshot-' + index).iCheck({
          checkboxClass: 'icheckbox_md',
          radioClass: 'iradio_md',
          increaseArea: '20%'
        })

        $('#btn-remove-snaphot-' + index).one('click', function(evt) {
          var id = index
          $('#box-webcam-' + id).remove()

          if ($('.box-webcam-item').length === 0) {
            $('#modalWebCam').removeClass('show-button-save')
          }
        })

        if (!$('#modalWebCam').hasClass('show-button-save')) {
          $('#modalWebCam').addClass('show-button-save')
        }

        $scope.viewButtonSaveSnaps = true
      }

      snapshots[index].get_canvas(add_snapshot)
    }

    $scope.AcquireWebcam = function() {
      UIkit.modal('#modalWebCam', { bgclose: false }).show()

      $('#modalWebCam').removeClass('show-button-save')

      $timeout(function() {
        function initializeWebCam() {
          var options = {
            quality: 1.0,
            shutter_ogg_url: '/assets/js/jpeg_camera/dist/shutter.ogg',
            shutter_mp3_url: '/assets/js/jpeg_camera/dist/shutter.mp3',
            swf_url: '/assets/js/jpeg_camera/dist/jpeg_camera.swf',
            message_allow_access: $scope.MSG_ALLOW_ACCESS_WEBCAM,
            message_denied_access: $scope.MSG_DENIED_ACCESS_WEBCAM,
            message_error_init: $scope.MESSAGE_ERROR_INIT_WEBCAM
          }

          camera = new JpegCamera('#camera', options)
            .ready(function(info) {
              console.log(
                'Camera resolution: ' +
                  info.video_width +
                  'x' +
                  info.video_height
              )
            })
            .error(function(tes) {
              UIkit.modal.confirm(
                [
                  '<h3><i class="material-icons uk-text-warning">warning</i> ',
                  $scope.OCCURRED_AN_ERROR_WHEN_TRYING_TO_INITIALIZE_THE_CAMERA_TRY_AGAIN,
                  '</h3>'
                ].join(''),
                function() {
                  camera.stop()
                  initializeWebCam()
                },
                function() {
                  UIkit.modal('#modalWebCam').hide()
                },
                { labels: { Ok: $scope['YES'], Cancel: $scope['CANCEL'] } }
              )
            })
        }

        initializeWebCam()
      }, 2000)
    }

    $('#modalWebCam').on({
      'hide.uk.modal': function() {
        if ($('.box-webcam-item').length > 0) {
          $('.box-webcam-item').each(function() {
            $(this).remove()
          })
        }
        snapshots = []
        if (undefined !== camera) {
          camera.stop()
          camera.discard_all()
        }
      }
    })

    /*
     * SELECIONA TODOS OS SELECTS
     */
    $scope.selectAllFields = function(selected) {
      if ('' !== selected && undefined !== selected) {
        for (var x in $scope.selectize_scanupload) {
          $scope.selectize_scanupload[x] = selected
        }

        $scope.selectize_all_scanupload_all = selected
      }
    }

    function getModelVal($modelName) {
      return $scope[$modelName]
    }

    function setModelVal($modelName, value) {
      $scope[$modelName] = value
    }

    $scope.setFileName = function(x, value) {
      $scope.file_name[x] = value
    }

    function getFileName(x) {
      return $scope.file_name[x]
    }

    $scope.switSelected = function(x, modelValue) {
      $scope.selectize_scanupload[x] = modelValue
    }

    function clickThumb(index) {
      $scope.imageBufferCount = DWObject.SelectedImagesCount
      $scope.imageSaveCount = DWObject.HowManyImagesInBuffer

      loadThumb(index)
    }

    //Reseta a tela
    function resetDraw() {
      DWObject.RemoveAllImages()
      DWObjectLargeViewer.RemoveAllImages()
      $scope.showBtnSave = false
    }

    function isJson(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }

    //Funções
    function loadThumb(index) {
      if (scannerLoaded === 1) {
        index = DWObject.HowManyImagesInBuffer - 1
        scannerLoaded = 0
      }

      if (!$.isArray(index)) {
        //Ao digitalizar carrega sempre a ultima imagem
        //index=(DWObject.HowManyImagesInBuffer-1);

        if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
          console.log('loading thumb...')
          currentImage = index

          DWObject.CopyToClipboard(index)

          DWObjectLargeViewer.SetViewMode(-1, -1)

          DWObjectLargeViewer.Zoom = 0.3797108212689002

          DWObjectLargeViewer.RemoveAllImages()
          DWObjectLargeViewer.LoadDibFromClipboard()
          $scope.showBtnSave = true

          //Adiciona o evento click no item
          $timeout(function() {
            //Adiciona CSS ao thumb selecionado
            var $thumbs = $(
              '#dwtcontrolContainer .dynamsoft-dwt-container-box > div > div'
            )
            $thumbs.unbind('click')
            $thumbs.bind('click', function(event) {
              $thumbs.removeClass('active-thumb')
              //O scroll só exibe dois itens por vez
              var indexThumb = $thumbs.index(this)
              $thumbs.eq(indexThumb).addClass('active-thumb')
            })

            $scope.showBtnSave = true
          }, 300)
        }
      }
    }

    //Executa somente no carregamento
    function initLoadingThumb() {
      if ($scope.remove_pages_blank === true && !hardwarePageBlank) {
        var countImages = DWObject.HowManyImagesInBuffer

        function removeRecursive(i) {
          var old_from = $('#ionslider_noise_detection > input').data(
            'ionRangeSlider'
          ).old_from
          DWObject.BlankImageMaxStdDev = parseInt(old_from === 0 ? 1 : old_from)
          //Remove image
          if (DWObject.IsBlankImageExpress(i)) {
            DWObject.RemoveImage(i)
            DWObjectLargeViewer.RemoveAllImages()
            //if remove continue i
            if (i + 1 < countImages) {
              removeRecursive(i)
            } else {
              if (DWObject.HowManyImagesInBuffer === 0) {
                $scope.showBtnSave = false
              }
            }
          } else {
            if (i + 1 < countImages) {
              removeRecursive(i + 1)
            } else {
              if (DWObject.HowManyImagesInBuffer === 0) {
                $scope.showBtnSave = false
                DWObjectLargeViewer.RemoveAllImages()
              }
            }
          }
        }

        removeRecursive(0)
      }
    }

    function addPercent(i, arrKeys) {
      var percent = parseInt((i * 100) / arrKeys.length) + '%'
      $load_scanning_progress.css('width', percent)
      $load_scanning_progress.html(percent)
    }

    $scope.uploadMultiple = function(i, arrKeys, modalBlock) {
      if (arrKeys.length - 1 >= i) {
        var index = arrKeys[i]
        //console.log('--------Inicio---------');
        DWObject.CurrentImageIndexInBuffer = index
        console.log(DWObject.CurrentImageIndexInBuffer)
        DWObject.SetSelectedImageIndex(index, index)
        var saveOp = $scope.selectize_scanupload[index]
        DWObject.GetSelectedImagesSize(
          EnumDWT_ImageType[$scope.getParamSize(saveOp)]
        )

        //Adiciona o nome da imagem
        // var imagedata = DWObject.SaveSelectedImagesToBase64Binary();
        var doc = $stateParams.docsId
        var fileName = getFileName(index) + '-' + index + '.' + saveOp
        // console.log(fileName);
        var fileMessage = $scope.THE_FILE + fileName
        //console.log(fileMessage);

        var errorCallback = function(errorCode, errorString, sHttpResponse) {
          // console.log(errorCode);
          // console.log(errorString);
          // console.log('---------Fim----------');

          if (!isJson(sHttpResponse)) {
            notification.msg({
              message: [$scope.SCANNER_UPLOAD_ERROR, '<br>', fileName].join(''),
              status: 'warning',
              timeout: '1000'
            })

            uploadError.push(index)
          }
          var addI = (index += 1)
          addPercent(addI, arrKeys)
          $timeout(function() {
            $scope.uploadMultiple(addI, arrKeys, modalBlock)
          }, 100)
        }
        //Adiciona o token aqui caso expire resgata sempre o token atualizado

        utils.getToken({
          success: function(userData) {
            var uploadAction = [
              '/ecm/documents/',
              doc,
              '/files/upload',
              '?token=',
              $rootScope.currentUser.jwt
            ].join('')
            DWObject.HTTPUploadThroughPost(
              httpURL,
              DWObject.CurrentImageIndexInBuffer,
              uploadAction,
              fileName,
              EnumDWT_ImageType[$scope.getParamSize(saveOp)],
              errorCallback,
              errorCallback
            )
          }
        })
      } else {
        $load_scanning_progress.css('width', '100%')
        $load_scanning_progress.html('100%')
        $timeout(function() {
          if (uploadError.length > 0) {
            var imagesRemaining = []
            uploadError.map(function(value) {
              var fileName =
                getFileName(value) +
                '-' +
                value +
                '.' +
                $scope.selectize_scanupload[value]
              var src = $('#thumbnail-modal-' + value).attr('src')
              imagesRemaining.push(
                [
                  '<li class="uk-text-small"><div class="uk-input-group">',
                  '<span class="uk-input-group-addon">',
                  '<img class="img-error-modal" id="scan-thumb-error-modal-' +
                    value +
                    '" src="' +
                    src +
                    '"/>',
                  '</span>',
                  '<span class="uk-input-group-addon">',
                  fileName,
                  '</span>',
                  '<span class="uk-input-group-addon"><input type="checkbox" value="',
                  value,
                  '" name="check-modal-name-',
                  value,
                  '" id="check-modal-id-',
                  value,
                  '" class="scan-check-thumb-modal" checked /></span>',
                  '</div></li>'
                ].join('')
              )
            })
            var uploadingConfirm = false
            UIkit.modal.confirm(
              [
                '<div id="modal-confirm-scan"><h3><i class="material-icons uk-text-warning">warning</i> ',
                $scope.ERROR_HAS_OCCURRED_BY_TRYING_TO_SAVE_THE_FOLLOWING_IMAGES,
                '</h3><div class="uk-grid"><div style="max-height: 300px;overflow:auto" class="uk-width-1-1"><ul class="uk-list">',
                imagesRemaining.join(''),
                '</ul></div></div>',
                '</div>'
              ].join(''),
              function() {
                if (uploadingConfirm === false) {
                  uploadingConfirm = true
                  var newIterator = uploadError
                  //Clean upload error
                  uploadError = []
                  $scope.uploadMultiple(0, newIterator, modalBlock)
                  $timeout(function() {
                    //Libera o click novamente
                    uploadingConfirm = false
                  }, 2000)
                }
              },
              function() {
                modalBlock.hide()
                $modalSaveScanning.hide()
                //resetDraw();
              },
              {
                labels: {
                  Ok: $scope['TRY_UPLOAD_AGAIN'],
                  Cancel: $scope['CANCEL']
                }
              }
            )

            $timeout(function() {
              $('.img-error-modal').on('click', function(e) {
                $scope.viewImageLitebox(e)
              })
              var $btnCornfirm = $('#modal-confirm-scan')
                .parent()
                .parent()
                .find('.js-modal-confirm')

              var toogleBtnConfirm = function() {
                if (uploadError.length == 0) {
                  $btnCornfirm.each(function() {
                    $(this).prop('disabled', true)
                  })
                } else {
                  $btnCornfirm.each(function() {
                    $(this).prop('disabled', false)
                  })
                }
              }

              if (uploadError.length == 1) {
                $('.scan-check-thumb-modal').iCheck({
                  checkboxClass: 'icheckbox_md',
                  radioClass: 'iradio_md',
                  increaseArea: '20%'
                })
                $('.scan-check-thumb-modal').iCheck('disable')
              } else {
                $('.scan-check-thumb-modal')
                  .iCheck({
                    checkboxClass: 'icheckbox_md',
                    radioClass: 'iradio_md',
                    increaseArea: '20%'
                  })
                  .on('ifChecked', function(event) {
                    uploadError.push(parseInt($(event.target).prop('value')))
                    uploadError = uploadError.sort()
                    toogleBtnConfirm()
                  })
                  .on('ifUnchecked', function(event) {
                    uploadError.map(function(value, index) {
                      if (value + '' === $(event.target).prop('value')) {
                        uploadError.splice(index, 1)
                      }
                    })
                    uploadError = uploadError.sort()
                    toogleBtnConfirm()
                  })
              }
            }, 100)
          } else {
            modalBlock.hide()
            $modalSaveScanning.hide()
            notification.msg({
              message: $scope.UPLOAD_SUCCESS,
              status: 'success',
              timeout: '1000'
            })
            resetDraw()
          }
        }, 1000)
      }
    }

    $scope.saveAllImage = function(modalBlock) {
      uploadError = []
      DWObject.SelectedImagesCount = DWObject.HowManyImagesInBuffer
      var arrKeys = []
      for (var i = 0; i < DWObject.SelectedImagesCount; i++) {
        arrKeys.push(i)
      }
      $scope.uploadMultiple(0, arrKeys, modalBlock)
    }

    $scope.UploadImage = function() {
      $scope.saveImages($stateParams.docsId)
    }

    function onReady() {
      DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer')
      DWObjectLargeViewer = Dynamsoft.WebTwainEnv.GetWebTwain(
        'dwtcontrolContainerLargeViewer'
      )
      /*     window['_DWObject']=DWObject;
                      window['_DWObjectLargeViewer']=DWObjectLargeViewer;*/

      if (DWObject) {
        DWObject.IfShowUI = false
        DWObject.IfShowIndicator = false
        DWObjectLargeViewer.IfShowUI = false
        DWObjectLargeViewer.IfShowIndicator = false

        //Hide progress bar
        DWObject.IfShowCancelDialogWhenImageTransfer = false
        DWObject.IfShowProgressBar = false

        /*==Ajusta o taminho da imagem na lista de thumbnail==*/
        DWObject.SetViewMode(1, 3)

        DWObject.RegisterEvent('OnMouseClick', clickThumb)

        //Carrega a imagem que foi lida
        DWObject.RegisterEvent('OnBitmapChanged', loadThumb)

        var count = DWObject.SourceCount // Populate how many sources are installed in the system
        for (var i = 0; i < count; i++) {
          var _obj = { title: DWObject.GetSourceNameItems(i), value: i }
          $scope.selectize_scansource_options.push(_obj)
        }

        /*   var arySource = DWObject.Addon.Webcam.GetSourceList();
                       for (var i = 0; i < arySource.length; i++) {
                           //console.log(arySource[i]);console.log('AAA')
                           $scope.selectize_camsource_options.push(arySource[i]);
                       }*/
        /*==================Seta os valores default ao carregar o plugin=====================*/
        $scope.activeImage = true
        $scope.selectize_scansource = '0'
        $scope.selectize_scanres = '100'
        $scope.selectize_scantype = '0'

        // do something

        function resizeLayers() {
          if (DWObject) {
            var $dwtcontrolContainer = $('#dwtcontrolContainer'),
              $dwtcontrolContainerLargeViewer = $(
                '#dwtcontrolContainerLargeViewer'
              ),
              $md_card_scanner = $('.md-card-scanner')

            var $md_card_scanner_height = $md_card_scanner.css('height')
            DWObject.Width = $dwtcontrolContainer.width()
            DWObjectLargeViewer.Width = $dwtcontrolContainerLargeViewer.width()
            DWObject.Height = $md_card_scanner_height
            DWObjectLargeViewer.Height = $md_card_scanner_height
          }
        }

        $rootScope.$on('$LayerScannerResized', function() {
          resizeLayers()
        })

        var $dwtcontrolContainer = $('#dwtcontrolContainer'),
          $dwtcontrolContainerLargeViewer = $('#dwtcontrolContainerLargeViewer')
        //Adiciona CSS ao thumb selecionado
        $thumbs = $(
          '#dwtcontrolContainer .dynamsoft-dwt-container-box > div > div'
        )
        $thumbs.removeClass('active-thumb')
        //O scroll só exibe dois itens por vez

        if ('undefined' != typeof index) {
          var indexThumb = (index + 1) % 2 === 0 ? 1 : 0

          $thumbs.eq(indexThumb).addClass('active-thumb')
        }

        //Exibe o botão salvar se houver um documento scaneado

        resizeLayers()
        setScantypeOptions()

        $dwtcontrolContainerLargeViewer.trigger('click')

        DWObject.RegisterEvent('OnPostAllTransfers', initLoadingThumb)
      }
    }

    $scope.documentInfo = ''
    $scope.documentBlockForUser = false
    $scope.documentBlockForVersion = false
    $scope.userInfo = $cookieStore.get('user_data')

    //3) Load Functions in scope
    var initAfterTranslateLoad = function() {
      //Se houver alteração no idioma atualiza o o scopo
      $rootScope.$on('$updateLanguageEvent', function() {
        $timeout(function() {
          setScantypeOptions()
        }, 500)
      })

      /* Carrega as informações do documento */
      dbSearch(docsService, 'view_scanning').get(
        { id: $stateParams.docsId },
        function(data) {
          $scope.documentInfo = data

          if (data.parent.versionActive) {
            /* Verifica se o documento esta bloqueado para edição */
            if ('blocked' in data && data.blocked) {
              if ($scope.userInfo.id === $scope.documentInfo.user_block.id) {
                $timeout(function() {
                  Dynamsoft.WebTwainEnv.Load()
                  Dynamsoft.WebTwainEnv.RegisterEvent(
                    'OnWebTwainReady',
                    onReady
                  )
                }, 500)

                $scope.documentBlockForUser = false
              } else {
                $scope.documentBlockForUser = true
              }

              $scope.documentBlockForVersion = false
            } else {
              $scope.documentBlockForUser = false
              $scope.documentBlockForVersion = true
            }
          } else {
            // Reload page or change state
            $timeout(function() {
              Dynamsoft.WebTwainEnv.Load()
              Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', onReady)
            }, 500)
          }
        }
      )
    }

    //2) Load Translates
    var initAfterJavascriptLoad = function() {
      AddTranslateVars(
        [
          'YES',
          'OCCURRED_AN_ERROR_WHEN_TRYING_TO_INITIALIZE_THE_CAMERA_TRY_AGAIN',
          'MESSAGE_ERROR_INIT_WEBCAM',
          'MSG_DENIED_ACCESS_WEBCAM',
          'MSG_ALLOW_ACCESS_WEBCAM',
          'SUCCESS',
          'TRY_UPLOAD_AGAIN',
          'ERROR_HAS_OCCURRED_BY_TRYING_TO_SAVE_THE_FOLLOWING_IMAGES',
          'YES',
          'CANCEL',
          'COLORFUL',
          'GRAY_SCALE',
          'BLACK_AND_WHITE',
          'CANSOURCE',
          'BTN_SELECT_SCANNING',
          'SAVE_FILE',
          'SELECT_FILE_TYPE',
          'FILE_NAME',
          'LOAD_SAVE_INFO',
          'UPLOAD_SUCCESS',
          'UPLOAD_ERROR',
          'SELECT_A_FILE',
          'SAVE_FILE_BTN',
          'SAVE_ALL_FILE_BTN',
          'SAVE_ALL_FILES_SELECTED',
          'FILE',
          'THE_FILE',
          'UPLOAD_SUCCESS',
          'SCANNER_UPLOAD_ERROR',
          'NO_FILES'
        ],
        $scope,
        initAfterTranslateLoad
      )
    }

    //1) Load Scripts
    $timeout(function() {
      //Limpa todas as instancias quando existir e faz o unload
      if (undefined !== window.Dynamsoft) {
        Dynamsoft.WebTwainEnv.Unload()
        initAfterJavascriptLoad()
      } else {
        //Se não tiver carregado as dependencias carrega
        $ocLazyLoad.load({
          serie: true,
          events: true,
          cache: true /* force loading*/,
          files: [
            '/assets/js/DynamWebTwain/dynamsoft.webtwain.initiate.js',
            '/assets/js/DynamWebTwain/dynamsoft.webtwain.config.js',
            '/assets/js/DynamWebTwain/dynamsoft.webtwain.install.js',
            '/assets/js/jpeg_camera/dist/swfobject.js',
            '/assets/js/jpeg_camera/dist/canvas-to-blob.js',
            '/assets/js/jpeg_camera/dist/jpeg_camera.js'
          ]
        })
      }
    })

    $scope.$on('ocLazyLoad.fileLoaded', function(e, module) {
      //init in  last iteration
      if (module === '/assets/js/jpeg_camera/dist/jpeg_camera.js') {
        initAfterJavascriptLoad()
      }
    })

    $scope.return = function() {
      if ($cookieStore.get('newDocumentBPM')) {
        var cookieStore = $cookieStore.get('newDocumentBPM')
        $timeout(function() {
          $state.go(cookieStore.nameState, cookieStore.arrayState)
        }, 800)
      } else {
        history.back()
      }
    }

    $timeout(function() {
      //Se caso não existir o style adiciona o style que seta o logo do modal que exibe a mensagem que o pugin não esta instalado
      if ($('#style-scan').length == 0) {
        var $img = $("<img id='image-scan-load'/>")
        //url do logo do workspace adicionado pelo usuário
        var urlLogo = [
          variablesConfig.hostInternalBucket,
          '/',
          sessionData.domain.name,
          '-',
          sessionData.workspace,
          '/logo.png'
        ].join('')
        //Tenta carregar
        $img
          .attr('src', urlLogo)
          .on('load', function(error) {
            $(
              '<style id="style-scan">.dynamsoft-dwt-dlg-header{background-image:url("' +
                urlLogo +
                '");}</style>'
            ).appendTo('head')
          })
          .one('error', function(error) {
            //ocorrendo erro pega a imagem default
            $timeout(function() {
              var addStyle = false
              //Se o style já foi inserido somente seta a imagem default
              var imgDefault = sessionData.domain.logo
              $('style').each(function() {
                if ($(this).attr('id') === 'style-scan') {
                  addStyle = true

                  $(this).text(
                    '.dynamsoft-dwt-dlg-header{background-image:url("' +
                      imgDefault +
                      '");}'
                  )
                }
              })
              //Se não existir cria o style
              if (!addStyle) {
                $(
                  '<style id="style-scan">.dynamsoft-dwt-dlg-header{background-image:url("' +
                    imgDefault +
                    '");}</style>'
                ).appendTo('head')
              }
            }, 1000)
          })
      }
    }, 500)

    //Força o fechamento do modal ao sair do state, e remove a classe que exibe o preloader
    $scope.$on('$destroy', function() {
      Dynamsoft.WebTwainEnv.CloseDialog()
      $('#page_preloader').removeClass('scan-loading')
      if (undefined !== camera) {
        camera.stop()
      }
    })
  }
])
