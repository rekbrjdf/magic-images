// actions.js

// Action types
export const FETCH_IMAGES_REQUEST = 'FETCH_IMAGES_REQUEST';
export const FETCH_IMAGES_SUCCESS = 'FETCH_IMAGES_SUCCESS';
export const FETCH_IMAGES_FAILURE = 'FETCH_IMAGES_FAILURE';

export const DELETE_IMAGE_REQUEST = 'DELETE_IMAGE_REQUEST';
export const DELETE_IMAGE_SUCCESS = 'DELETE_IMAGE_SUCCESS';
export const DELETE_IMAGE_FAILURE = 'DELETE_IMAGE_FAILURE';

// Action creators
export const fetchImagesRequest = () => ({
  type: FETCH_IMAGES_REQUEST,
});

export const fetchImagesSuccess = (images) => ({
  type: FETCH_IMAGES_SUCCESS,
  payload: images,
});

export const fetchImagesFailure = (error) => ({
  type: FETCH_IMAGES_FAILURE,
  payload: error,
});

export const deleteImageRequest = () => ({
  type: DELETE_IMAGE_REQUEST,
});

export const deleteImageSuccess = (imageId) => ({
  type: DELETE_IMAGE_SUCCESS,
  payload: imageId,
});

export const deleteImageFailure = (error) => ({
  type: DELETE_IMAGE_FAILURE,
  payload: error,
});

const param = window.location.search;

// Thunk action creators
export const fetchImages = () => async (dispatch) => {
  dispatch(fetchImagesRequest());
  try {
    const response = await fetch(`https://sonofleonid.ru/mini-app/api/images${param}`);
    const result = await response.json();
    dispatch(fetchImagesSuccess(result));
  } catch (error) {
    dispatch(fetchImagesFailure(error));
  }
};

export const deleteImage = (imageId) => async (dispatch) => {
  dispatch(deleteImageRequest());
  try {
    const response = await fetch(
      `https://sonofleonid.ru/mini-app/api/delete${param}&image_id=${imageId}`,
      {
        method: 'DELETE',
      },
    );
    const result = await response.json();
    if (result.message === 'Успешное удаление') {
      dispatch(deleteImageSuccess(imageId));
    } else {
      dispatch(deleteImageFailure('Ошибка при удалении изображения'));
    }
  } catch (error) {
    dispatch(deleteImageFailure(error));
  }
};
