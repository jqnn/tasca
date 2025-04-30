export type MutationMessages = {
  loading: {
    title: string;
    message: string;
  };
  success: {
    title: string;
    message: string;
  };
};

export type DialogInformation = {
  title: string;
  description: string;
};

export const defaultMutationMessages: MutationMessages = {
  loading: {
    title: "common.mutation.loading.title",
    message: "common.mutation.loading.message",
  },
  success: {
    title: "common.mutation.success.title",
    message: "common.mutation.success.message",
  },
};

export const defaultDialogInformation: DialogInformation = {
  title: "common.dialog.title",
  description: "common.dialog.description",
};
