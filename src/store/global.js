import { handleActions } from 'redux-actions'

const initialState = {
  scene: '',
  showAuth: false,
  showImagePreview: false,
  srcImagePreview: null
}

export default handleActions({

  GLOBAL_UPDATE_SCENE (state, action) {
    return Object.assign({}, state, action.payload, {
      scene: action.payload.scene
    })
  },

  GLOBAL_UPDATE_SHOW_AUTH (state, action) {
    return Object.assign({}, state, action.payload, {
      showAuth: action.payload.showAuth
    })
  },
  GLOBAL_UPDATE_SHOW_IMAGE_PREVIEW (state, action) {
    return Object.assign({}, state, action.payload, {
      showImagePreview: action.payload.showImagePreview
    })
  },

  GLOBAL_UPDATE_CHANGE_IMAGE_SRC (state, action) {
    return Object.assign({}, state, action.payload, {
      srcImagePreview: action.payload.srcImagePreview
    })
  }

}, initialState)

const globalSceneUpdate = (scene) => async (dispatch, getState) => {
  console.log('globalSceneUpdate getState', getState())

  dispatch({
    type: 'GLOBAL_UPDATE_SCENE',
    payload: {
      scene
    }
  })
}

const globalShowAuthUpdate = (showAuth) => async (dispatch, getState) => {
  console.log('globalShowAuthUpdate getState', getState())

  dispatch({
    type: 'GLOBAL_UPDATE_SHOW_AUTH',
    payload: {
      showAuth
    }
  })
}

const globalShowImagePreviewUpdate = (showImagePreview) => async (dispatch, getState) => {
  console.log('globalShowImagePreviewUpdate getState', getState())

  dispatch({
    type: 'GLOBAL_UPDATE_SHOW_IMAGE_PREVIEW',
    payload: {
      showImagePreview
    }
  })
}

const globalChangeImageSrcUpdate = (srcImagePreview) => async (dispatch, getState) => {
  console.log('globalChangeImageSrcUpdate getState', getState())

  dispatch({
    type: 'GLOBAL_UPDATE_CHANGE_IMAGE_SRC',
    payload: {
      srcImagePreview
    }
  })
}

export {
  globalSceneUpdate,
  globalShowAuthUpdate,
  globalShowImagePreviewUpdate,
  globalChangeImageSrcUpdate
}
