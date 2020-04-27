<template>
  <div style="padding: 50px 0; height: auto;">
    <div style="width: 980px; margin: 0 auto;">
      <div style="width:90%;padding: 15px;">
        <select style="width:40%; height:34px;" id="source2">
          <option disabled selected>Select A Device</option>
        </select>
        <button style="height:34px;" @click="AcquireImage">Scan</button>
        <button style="height:34px;" @click="LoadImage">Load</button>
        <button style="height:34px;" @click="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button style="height:34px;" @click="RemoveAll">
          <i class="fas fa-recycle"></i>
        </button>
        <button value="Rotate 180°" style="height:34px;" @click="Rotate180">
          <i class="fas fa-retweet"></i>
        </button>
        <button value="Rotate Left" style="height:34px;" @click="RotateLeft">
          <i class="fas fa-undo-alt"></i>
        </button>
        <button value="Rotate Right" style="height:34px;" @click="RotateRight">
          <i class="fas fa-redo-alt"></i>
        </button>
        <button value="Mirror" style="height:34px;" @click="Mirror">
          <i class="fas fa-arrows-alt-h"></i>
        </button>
        <button value="Flip" style="height:34px;" @click="Flip">
          <i class="fas fa-arrows-alt-v"></i>
        </button>
      </div>
      <div style="width:90%;">
        <div
          id="dwtcontrolContainer"
          style="float: left; position:relative; margin-right:3%;width:20%"
        ></div>
        <div
          id="dwtcontrolContainerLargeViewer"
          style="float: left; position:relative;width:75%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Dynamsoft from 'dwt'
export default {
  data: () => ({
    title: 'Using Dynamic Web TWAIN in Vue Project',
    DWObject: false,
    DWObjectLargeViewer: false
  }),
  created() {
    Dynamsoft.WebTwainEnv.AutoLoad = false
    Dynamsoft.WebTwainEnv.Containers = [
      {
        ContainerId: 'dwtcontrolContainer',
        Width: '100%',
        Height: '500px'
      }
    ]
    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {
      this.Dynamsoft_OnReady()
    })
    Dynamsoft.WebTwainEnv.Trial = true
    // Dynamsoft.WebTwainEnv.ProductKey =
    //   'f0068NQAAACyMptTIXKyBr6qIbXRS0lZrq8O2MOXUBCZXgQZoS2BC73rJ+yg/UsO+u2RD2ZQaJi6gahHxi0FPUZ44ufcaeg8=;f0068NQAAAIGJBX/F85UzyTyklyoF7gYgF5WSbZqyVGNoITEDqIBePdvec7c75ptkqJs6VlWEYLjNm2QDpWnGsIzAF+3Mlaw='
    Dynamsoft.WebTwainEnv.ProductKey =
      't0141cQMAACCG0RYaq6/crIMV/JeasnfXv3IDw4WHrIG1i57UR2yz+mIJxFHPd0KPR/VeuQLre6euCU2VfKVoSmcv+nGWYJAERq/MugsZzYKpzJHEaPTWshv/Y1b5+ZcEc2zGiXKjBeO5YZpHEf29Ic/8MVownhumeQqZj2ZopGC0YDw3xLVx8+Zm8gY1ma8m'
  },
  mounted() {
    Dynamsoft.WebTwainEnv.AutoLoad = false
    Dynamsoft.WebTwainEnv.Containers = [
      {
        ContainerId: 'dwtcontrolContainer',
        Width: '100%',
        Height: '500px'
      }
    ]
    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {
      this.Dynamsoft_OnReady()
    })
    Dynamsoft.WebTwainEnv.Trial = true
    // Dynamsoft.WebTwainEnv.ProductKey =
    //   'f0068NQAAACyMptTIXKyBr6qIbXRS0lZrq8O2MOXUBCZXgQZoS2BC73rJ+yg/UsO+u2RD2ZQaJi6gahHxi0FPUZ44ufcaeg8=;f0068NQAAAIGJBX/F85UzyTyklyoF7gYgF5WSbZqyVGNoITEDqIBePdvec7c75ptkqJs6VlWEYLjNm2QDpWnGsIzAF+3Mlaw='
    Dynamsoft.WebTwainEnv.ProductKey =
      't0141cQMAACCG0RYaq6/crIMV/JeasnfXv3IDw4WHrIG1i57UR2yz+mIJxFHPd0KPR/VeuQLre6euCU2VfKVoSmcv+nGWYJAERq/MugsZzYKpzJHEaPTWshv/Y1b5+ZcEc2zGiXKjBeO5YZpHEf29Ic/8MVownhumeQqZj2ZopGC0YDw3xLVx8+Zm8gY1ma8m'

    Dynamsoft.WebTwainEnv.Load()
  },
  methods: {
    Dynamsoft_OnReady() {
      const vm = this
      // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
      this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer')
      if (this.DWObject) {
        Dynamsoft.WebTwainEnv.CreateDWTObject(
          'dwtcontrolContainerLargeViewer',
          dwtObject => {
            this.DWObjectLargeViewer = dwtObject
            if (this.DWObjectLargeViewer) {
              this.DWObjectLargeViewer.Width = '100%'
              this.DWObjectLargeViewer.Height = 500
              // Set the view to hold one image only
              this.DWObjectLargeViewer.SetViewMode(-1, -1)
              // Set it to hold one image only
              this.DWObjectLargeViewer.MaxImagesInBuffer = 1
            }
          }
        )
        // Set the view to show four images
        this.DWObject.SetViewMode(1, 4)

        // Add the sources in a drop-down list
        var count = this.DWObject.SourceCount
        if (count) {
          for (var i = 0; i < count; i++)
            document
              .getElementById('source2')
              .options.add(new Option(this.DWObject.GetSourceNameItems(i), i))

          this.DWObject.SelectSourceByIndex(
            (document.getElementById('source2').selectedIndex = 1)
          )
        }
        // Register the events
        this.DWObject.RegisterEvent(
          'OnPostTransfer',
          this.Dynamsoft_OnPostTransfer
        )
        this.DWObject.RegisterEvent('OnPostLoad', this.Dynamsoft_OnPostLoad)
        this.DWObject.RegisterEvent('OnMouseClick', this.Dynamsoft_OnMouseClick)
      }
    },
    AcquireImage() {
      if (this.DWObject) {
        this.DWObject.SelectSourceByIndex(
          document.getElementById('source2').selectedIndex - 1
        )
        this.DWObject.OpenSource()
        this.DWObject.IfDisableSourceAfterAcquire = true
        this.DWObject.AcquireImage()
      }
    },
    OnSuccess() {
      console.log('successful')
    },
    OnFailure(errorCode, errorString) {
      alert(errorString)
    },
    LoadImage() {
      if (this.DWObject) {
        // Open the system's file dialog to load image
        this.DWObject.IfShowFileDialog = true
        // Load images in all supported formats (.bmp, .jpg, .tif, .png, .pdf).
        this.DWObject.LoadImageEx(
          '',
          Dynamsoft.EnumDWT_ImageType.IT_ALL,
          this.OnSuccess,
          this.OnFailure
        )
      }
    },

    Remove() {
      if (!this.checkIfImagesInBuffer()) return

      this.DWObject.RemoveAllSelectedImages()
      this.DWObjectLargeViewer.RemoveAllSelectedImages()
      this.updateLargeViewer()
    },
    RemoveAll() {
      this.DWObject.RemoveAllImages()
      this.DWObjectLargeViewer.RemoveAllImages()
    },
    Rotate180() {
      this.DWObjectLargeViewer.Rotate(
        this.DWObjectLargeViewer.CurrentImageIndexInBuffer,
        180,
        true
      )
      this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, 180, true)
    },
    RotateLeft() {
      this.DWObjectLargeViewer.RotateLeft(
        this.DWObjectLargeViewer.CurrentImageIndexInBuffer
      )
      this.DWObject.RotateLeft(this.DWObject.CurrentImageIndexInBuffer)
    },
    RotateRight() {
      this.DWObjectLargeViewer.RotateRight(
        this.DWObjectLargeViewer.CurrentImageIndexInBuffer
      )
      this.DWObject.RotateRight(this.DWObject.CurrentImageIndexInBuffer)
    },
    Mirror() {
      this.DWObjectLargeViewer.Mirror(
        this.DWObjectLargeViewer.CurrentImageIndexInBuffer
      )
      this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer)
    },
    Flip() {
      this.DWObjectLargeViewer.Flip(
        this.DWObjectLargeViewer.CurrentImageIndexInBuffer
      )
      this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer)
    },
    checkIfImagesInBuffer() {
      return this.DWObject.HowManyImagesInBuffer == 0 ? false : true
    },
    Dynamsoft_OnPostTransfer() {
      this.updateLargeViewer()
    },
    Dynamsoft_OnPostLoad(path, name, type) {
      this.updateLargeViewer()
    },
    Dynamsoft_OnMouseClick() {
      this.updateLargeViewer()
    },
    updateLargeViewer() {
      if (!this.checkIfImagesInBuffer()) return

      this.DWObject.CopyToClipboard(this.DWObject.CurrentImageIndexInBuffer)
      // Load the image from Clipboard into the large viewer.
      this.DWObjectLargeViewer.LoadDibFromClipboard()
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css');
</style>
