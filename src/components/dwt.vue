<template>
  <div id="wrapper">
    <div id="demoContent">
      <div id="dwtScanDemo">
        <div class="ct-top" style="text-align:left;">
          <span class="title">Document Scanning</span>
          <span class="desc">Related products:</span>
          <a
            target="_blank"
            href="https://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx"
          >
            <img
              src="./assets/images/icon-dwt.svg"
              style="height:35px"
              title="Dynamic Web TWAIN"
              alt="Dynamic Web TWAIN"
            />
          </a>
        </div>
        <div id="DWTcontainer" class="container">
          <div id="DWTcontainerTop">
            <div id="divEdit">
              <ul class="operateGrp">
                <li>
                  <img
                    src="./assets/images/ShowEditor.png"
                    title="Show Image Editor"
                    alt="Show Image Editor"
                    id="btnEditor"
                    @click="btnShowImageEditor_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/RotateLeft.png"
                    title="Rotate Left"
                    alt="Rotate Left"
                    id="btnRotateL"
                    @click="btnRotateLeft_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/RotateRight.png"
                    title="Rotate Right"
                    alt="Rotate Right"
                    id="btnRotateR"
                    @click="btnRotateRight_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/Rotate180.png"
                    alt="Rotate 180"
                    title="Rotate 180"
                    @click="btnRotate180_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/Mirror.png"
                    title="Mirror"
                    alt="Mirror"
                    id="btnMirror"
                    @click="btnMirror_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/Flip.png"
                    title="Flip"
                    alt="Flip"
                    id="btnFlip"
                    @click="btnFlip_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/RemoveSelectedImages.png"
                    title="Remove Selected Images"
                    alt="Remove Selected Images"
                    id="DW_btnRemoveCurrentImage"
                    @click="btnRemoveCurrentImage_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/RemoveAllImages.png"
                    title="Remove All Images"
                    alt="Remove All Images"
                    id="DW_btnRemoveAllImages"
                    @click="btnRemoveAllImages_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/ChangeSize.png"
                    title="Change Image Size"
                    alt="Change Image Size"
                    id="btnChangeImageSize"
                    @click="btnChangeImageSize_onclick()"
                  />
                </li>
                <li>
                  <img
                    src="./assets/images/Crop.png"
                    title="Crop"
                    alt="Crop"
                    id="btnCrop"
                    @click="btnCrop_onclick()"
                  />
                </li>
              </ul>
              <div id="ImgSizeEditor" style="visibility:hidden">
                <ul>
                  <li>
                    <label for="img_height">
                      New Height :
                      <input
                        type="text"
                        id="img_height"
                        style="width:50%;"
                        size="10"
                      />
                      pixel
                    </label>
                  </li>
                  <li>
                    <label for="img_width">
                      New Width :&nbsp;
                      <input
                        type="text"
                        id="img_width"
                        style="width:50%;"
                        size="10"
                      />
                      pixel
                    </label>
                  </li>
                  <li>
                    Interpolation method:
                    <select size="1" id="InterpolationMethod">
                      <option value></option>
                    </select>
                  </li>
                  <li style="text-align:center;">
                    <input
                      type="button"
                      value="   OK   "
                      id="btnChangeImageSizeOK"
                      @click="btnChangeImageSizeOK_onclick()"
                    />
                    <input
                      type="button"
                      value=" Cancel "
                      id="btnCancelChange"
                      @click="btnCancelChange_onclick()"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div id="dwtcontrolContainer"></div>
            <div id="btnGroupBtm" class="clearfix">
              <div class="ct-lt">
                Page:
                <input
                  id="DW_btnFirstImage"
                  @click="btnFirstImage_onclick()"
                  type="button"
                  value=" |&lt; "
                />&nbsp;
                <input
                  id="DW_btnPreImage"
                  @click="btnPreImage_onclick()"
                  type="button"
                  value=" &lt; "
                />&nbsp;&nbsp;
                <input
                  type="text"
                  size="2"
                  id="DW_CurrentImage"
                  readonly="readonly"
                />
                /
                <input
                  type="text"
                  size="2"
                  id="DW_TotalImage"
                  readonly="readonly"
                />&nbsp;&nbsp;
                <input
                  id="DW_btnNextImage"
                  @click="btnNextImage_onclick()"
                  type="button"
                  value=" &gt; "
                />&nbsp;
                <input
                  id="DW_btnLastImage"
                  @click="btnLastImage_onclick()"
                  type="button"
                  value=" &gt;| "
                />
              </div>
              <div class="ct-rt">
                Preview Mode:
                <select
                  size="1"
                  id="DW_PreviewMode"
                  @change="setlPreviewMode()"
                >
                  <option value="0">1X1</option>
                  <option value="1">2X2</option>
                  <option value="2">3X3</option>
                  <option value="3">4X4</option>
                  <option value="4">5X5</option>
                </select>
                <br />
              </div>
            </div>
          </div>
          <div id="ScanWrapper">
            <div id="divScanner" class="divinput">
              <ul class="PCollapse">
                <li>
                  <div class="divType">
                    <div class="mark_arrow expanded"></div>
                    Custom Scan
                  </div>
                  <div id="div_ScanImage" class="divTableStyle">
                    <ul id="ulScaneImageHIDE">
                      <li>
                        <label for="source">
                          <p>Select Source:</p>
                        </label>
                        <select
                          size="1"
                          id="source"
                          style="position:relative;"
                          @change="source_onchange()"
                        >
                          <option value></option>
                        </select>
                      </li>
                      <li style="display:none;" id="pNoScanner">
                        <a
                          href="javascript: void(0)"
                          class="ShowtblLoadImage"
                          style="color:#fe8e14"
                          id="aNoScanner"
                          >(No TWAIN compatible drivers detected)</a
                        >
                      </li>
                      <li id="divProductDetail"></li>
                      <li class="tc">
                        <button
                          id="btnScan"
                          disabled="disabled"
                          @click="acquireImage()"
                        >
                          Scan
                        </button>
                      </li>
                    </ul>
                    <div id="tblLoadImage" style="visibility:hidden;">
                      <a href="javascript: void(0)" class="ClosetblLoadImage">
                        <img
                          src="./assets/images/icon-ClosetblLoadImage.png"
                          alt="Close tblLoadImage"
                        />
                      </a>
                      <p>You can Install a Virtual Scanner:</p>
                      <p>
                        <a
                          id="samplesource32bit"
                          href="https://download.dynamsoft.com/tool/twainds.win32.installer.2.1.3.msi"
                          >32-bit Sample Source</a
                        >
                        <a
                          id="samplesource64bit"
                          style="display:none;"
                          href="https://download.dynamsoft.com/tool/twainds.win64.installer.2.1.3.msi"
                          >64-bit Sample Source</a
                        >
                        from
                        <a target="_blank" href="http://www.twain.org">TWG</a>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="divType">
                    <div class="mark_arrow collapsed"></div>
                    Load Images or PDFs
                  </div>
                  <div
                    id="div_LoadLocalImage"
                    style="display: none"
                    class="divTableStyle"
                  >
                    <ul>
                      <li class="tc">
                        <button
                          class="btnOrg"
                          @click="btnLoadImagesOrPDFs_onclick()"
                        >
                          Load
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div id="divUpload" class="divinput mt30" style="position:relative">
              <ul>
                <li class="toggle">Save Documents</li>
                <li>
                  <p>File Name:</p>
                  <input type="text" size="20" id="txt_fileName" />
                </li>
                <li style="padding-right:0;">
                  <label for="imgTypebmp">
                    <input
                      type="radio"
                      value="bmp"
                      name="ImageType"
                      id="imgTypebmp"
                    />
                    BMP
                  </label>
                  <label for="imgTypejpeg">
                    <input
                      type="radio"
                      value="jpg"
                      name="ImageType"
                      id="imgTypejpeg"
                    />
                    JPEG
                  </label>
                  <label for="imgTypetiff">
                    <input
                      type="radio"
                      value="tif"
                      name="ImageType"
                      id="imgTypetiff"
                    />
                    TIFF
                  </label>
                  <label for="imgTypepng">
                    <input
                      type="radio"
                      value="png"
                      name="ImageType"
                      id="imgTypepng"
                    />
                    PNG
                  </label>
                  <label for="imgTypepdf">
                    <input
                      type="radio"
                      value="pdf"
                      name="ImageType"
                      id="imgTypepdf"
                    />
                    PDF
                  </label>
                </li>
                <li>
                  <label for="MultiPageTIFF">
                    <input type="checkbox" id="MultiPageTIFF" /> Multi-Page TIFF
                  </label>
                  <label for="MultiPagePDF">
                    <input type="checkbox" id="MultiPagePDF" /> Multi-Page PDF
                  </label>
                </li>
                <li>
                  <input
                    id="btnSave"
                    class="btnOrg"
                    type="button"
                    value="Save to Local"
                    @click="saveUploadImage('local')"
                  />
                  <input
                    id="btnUpload"
                    class="btnOrg"
                    type="button"
                    value="Upload to Server"
                    @click="saveUploadImage('server')"
                  />
                </li>
              </ul>
            </div>
          </div>
          <div id="DWTcontainerBtm" class="clearfix">
            <div id="DWTemessageContainer">
              <div id="DWTdivMsg" class="clearfix" style="text-align:left;">
                Message:
                <br />
                <div id="DWTemessage" @dblclick="clearmessages()"></div>
              </div>
            </div>
            <div id="divNoteMessage"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./dwt.js"></script>

<style rel="stylesheet/stylus" scoped>
@import 'dwt.css';
</style>
