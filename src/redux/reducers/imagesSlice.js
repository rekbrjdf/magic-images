import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  loading: false,
  error: null,
};

const param = window.location.search;

export const fetchImages = createAsyncThunk('images/fetchImages', async () => {
  try {
    const response = await fetch(`https://sonofleonid.ru/mini-app/api/images${param}`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching images: ${error.message}`);
  }
});

export const deleteImage = createAsyncThunk('images/deleteImage', async (imageId) => {
  try {
    const response = await fetch(
      `https://sonofleonid.ru/mini-app/api/delete${param}&image_id=${imageId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    const data = await response.json();
    if (data.message === 'Успешное удаление') {
      return imageId;
    }
    throw new Error('Failed to delete image');
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
});

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter((image) => image.id !== action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default imagesSlice.reducer;
