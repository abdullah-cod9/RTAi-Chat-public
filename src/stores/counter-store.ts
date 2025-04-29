import { Chat } from "@/app/actions/db/actions";
import { create } from "zustand";
import { createStore } from "zustand/vanilla";

export type CounterState = {
  storeInput: string | null;
};

export type CounterActions = {
  setStoreInput: (value: string) => void;
  reset: () => void;
};

export type CounterStore = CounterState & CounterActions;

export const defaultInitState: CounterState = {
  storeInput: null,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState,
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    setStoreInput: (value: string) => set(() => ({ storeInput: value })),
    reset: () => {
      set(defaultInitState);
    },
  }));
};

export type RenameState = {
  storeRenameId: string | null;
};

export type RenameActions = {
  setStoreRenameId: (value: string) => void;
  reset: () => void;
};

export type RenameStore = RenameState & RenameActions;

export const renameInitState: RenameState = {
  storeRenameId: null,
};
// Create your store, which includes both state and (optionally) actions
export const useRenameChatStore = create<RenameStore>((set) => ({
  storeRenameId: null,
  setStoreRenameId: (value: string) => set(() => ({ storeRenameId: value })),
  reset: () => {
    set(renameInitState);
  },
}));
export type ChatState = {
  chatStore: Chat | null;
};

export type ChatActions = {
  setStoreChat: (value: Chat) => void;
  reset: () => void;
};

export type ChatStore = ChatState & ChatActions;

export const chatInitState: ChatState = {
  chatStore: null,
};
// Create your store, which includes both state and (optionally) actions
export const useChatStore = create<ChatStore>((set) => ({
  chatStore: null,
  setStoreChat: (value: Chat) => set(() => ({ chatStore: value })),
  reset: () => {
    set(chatInitState);
  },
}));

export type QueryState = {
  queryStore: { q: string; model: string | null } | null;
};

export type QueryActions = {
  setStoreQuery: (value: { q: string; model: string | null } | null) => void;
  reset: () => void;
};

export type QueryStore = QueryState & QueryActions;

export const queryInitState: QueryState = {
  queryStore: null,
};
export const useQueryStore = create<QueryStore>((set) => ({
  queryStore: null,
  setStoreQuery: (value: { q: string; model: string | null } | null) =>
    set(() => ({ queryStore: value })),
  reset: () => {
    set(queryInitState);
  },
}));

export type EditorState = {
  editorStore: string;
};

export type EditorActions = {
  setEditorStore: (value: string) => void;
  reset: () => void;
};

export type EditorStore = EditorState & EditorActions;

export const editorInitState: EditorState = {
  editorStore: "",
};
export const useEditorStore = create<EditorStore>((set) => ({
  editorStore: "",
  setEditorStore: (value: string) => set(() => ({ editorStore: value })),
  reset: () => {
    set(editorInitState);
  },
}));
export type AttachmentsState = {
  attachmentsStore: {
    id: string;
    name: string;
    url: string;
    type: "image" | "pdf" | 'office';
  } | null;
};

export type AttachmentsActions = {
  setAttachmentsStore: (value: {
    id: string;
    name: string;
    url: string;
    type: "image" | "pdf" | 'office';
  }) => void;
  reset: () => void;
};

export type AttachmentsStore = AttachmentsState & AttachmentsActions;

export const attachmentsInitState: AttachmentsState = {
  attachmentsStore: null,
};
export const useAttachmentsStore = create<AttachmentsStore>((set) => ({
  attachmentsStore: null,
  setAttachmentsStore: (value: {
    id: string;
    name: string;
    url: string;
    type: "image" | "pdf" | 'office';
  }) => set(() => ({ attachmentsStore: value })),
  reset: () => {
    set(attachmentsInitState);
  },
}));
export type SettingsState = {
  settingsStore: boolean;
};

export type SettingsActions = {
  setSettingsStore: (value: boolean) => void;
  reset: () => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const settingsInitState: SettingsState = {
  settingsStore: false,
};
export const useOpenSettingsStore = create<SettingsStore>((set) => ({
  settingsStore: false,
  setSettingsStore: (value: boolean) => set(() => ({ settingsStore: value })),
  reset: () => {
    set(settingsInitState);
  },
}));
