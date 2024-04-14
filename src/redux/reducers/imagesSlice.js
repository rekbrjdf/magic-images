import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  loading: false,
  data: [],
  taskStatus: null, // Для отслеживания статуса задачи
};

const baseURL = 'https://sonofleonid.ru/mini-app/api';

const param = window.location.search;

export const fetchImages = createAsyncThunk('images/fetchImages', async () => {
  try {
    const response = await fetch(`${baseURL}/images${param}`);
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
    const response = await fetch(`${baseURL}/delete${param}&image_id=${imageId}`, {
      method: 'DELETE',
    });
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

export const checkTaskStatus = createAsyncThunk(
  'images/checkTaskStatus',
  async ({ taskId, attempt = 1 }, { dispatch }) => {
    try {
      const response = await fetch(`https://sonofleonid.ru/mini-app/task/${taskId}${param}`);
      console.log(response, 'response 222222222222');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const { status } = data;

      if (status === 'success') {
        // Если задача выполнена успешно, обновляем список изображений
        dispatch(fetchImages());
      } else if (status === 'pending' && attempt < 5) {
        console.log(
          `Попытка ${attempt}: Задача в процессе выполнения, проверка статуса через 30 секунд...`,
        );
        setTimeout(() => {
          dispatch(checkTaskStatus({ taskId, attempt: attempt + 1 }));
        }, 30000);
      } else if (status === 'error') {
        throw new Error(`Task failed with ID ${taskId}`);
      }
      return data;
    } catch (error) {
      console.error('Task status check error:', error);
      throw new Error(`Task status check error: ${error.message}`);
    }
  },
);

export const uploadImages = createAsyncThunk(
  'images/uploadImages',
  async ({ formData, selectedCellId }, { dispatch }) => {
    try {
      const response = await fetch(`${baseURL}/upload${param}&prompt_id=${selectedCellId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result, 'result 1111111111111111');
      const taskId = result.task_id;
      dispatch(fetchImages());
      // После получения taskId, запускаем проверку статуса задачи через 30 секунд
      setTimeout(() => {
        dispatch(checkTaskStatus({ taskId }));
      }, 30000);

      return result;
    } catch (error) {
      throw new Error(`Ошибка при загрузке изображения: ${error.message}`);
    }
  },
);

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
      })
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.data = {};
        state.error = action.error.message;
      })
      .addCase(checkTaskStatus.fulfilled, (state, action) => {
        state.taskStatus = action.payload.status;
      })
      .addCase(checkTaskStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default imagesSlice.reducer;
