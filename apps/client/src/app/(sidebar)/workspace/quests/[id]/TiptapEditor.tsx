"use client";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
  JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import Image from "@tiptap/extension-image";
import styles from "../../workspace.module.css";
import imageExtension from "../../../../../components/Tiptap/ImageExtension";
import fileExtension from "../../../../../components/Tiptap/FileExtension";
import { WorkspaceStore } from "../../../../../zustand/workspace";
import debounce from "lodash.debounce";
import { Quest } from "../../../../../generated/graphql";
import { update } from "idb-keyval";
import { QuestVersions } from "../../../../../utilities/types";
import { USER_ID } from "../../../../../utilities/userId";
const TiptapEditor = (props: { quest: Quest }) => {
  const { quest } = props;

  const updateQuest = useCallback(
    debounce(
      async ({ json, questId }: { questId: string; json: JSONContent }) => {
        const description = JSON.stringify(json);
        console.log("redacting quest attributes...");
        update(questId, (quest) => {
          quest.description = description;

          quest.version = quest.version + 1;
          return quest;
        });

        const versions = JSON.parse(
          localStorage.getItem(questId)!
        ) as QuestVersions;
        if (versions) {
          const newVersions = {
            server: versions.server + 1,
            local: versions.local + 1,
          };
          localStorage.setItem(questId, JSON.stringify(newVersions));
        }

        const listVersion = JSON.parse(
          localStorage.getItem(`LIST#${USER_ID}`)!
        ) as number;
        if (listVersion) {
          const newVersion = listVersion + 1;

          localStorage.setItem(`LIST#${USER_ID}`, JSON.stringify(newVersion));
        }

        // const result = await updateQuestAttributes({
        //   updateQuestTransactions: questTransactionsStore,
        // });
        // if (result) {
        //   clearQuestTransaction();
        // } else {
        //   console.log("content was not saved...");
        // }
      },
      4000
    ),
    []
  );
  const editor = useEditor({
    extensions: [StarterKit, Image, imageExtension, fileExtension],
    content:
      quest.description === "" || !quest.description
        ? ""
        : JSON.parse(quest.description!),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      updateQuest({ questId: quest.id, json });

      // updateQuest();
      // send the content to an API here
    },
  });
  const addImage = useCallback(
    async (files: FileList | null) => {
      const file = files![0];
      const filename = encodeURIComponent(file.name);
      const fileType = encodeURIComponent(file.type);
      const res = await fetch(
        `/api/upload-url?file=${filename}&fileType=${fileType}`
      );

      const { url, fields } = await res.json();
      console.log("fields", fields);
      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      const upload = await fetch(url, {
        method: "POST",

        body: formData,
      });
      if (upload.ok) {
        console.log("Uploaded successfully!");
      } else {
        console.log("upload failed", upload.statusText);
      }

      if (url && editor) {
        editor
          .chain()
          .focus()
          .insertContent(
            `<image-component src=${url}/${fields.key}></image-component>`
          )
          .run();
        editor.chain().focus().insertContent("<p></p>").run();
      }
    },
    [editor]
  );
  const addFile = useCallback(
    async (files: FileList | null) => {
      const file = files![0];
      const filename = encodeURIComponent(file.name);
      const fileType = encodeURIComponent(file.type);
      const res = await fetch(
        `/api/upload-file?file=${filename}&fileType=${fileType}`
      );

      const { url, fields } = await res.json();

      console.log("fields", fields);
      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      const upload = await fetch(url, {
        method: "POST",

        body: formData,
      });
      if (upload.ok) {
        console.log("Uploaded successfully!");
        if (url && editor) {
          editor
            .chain()
            .focus()
            .insertContent(
              `<file-component link=${url}/${fields.key} src=${fields.key}></file-component>`
            )
            .run();
          editor.chain().focus().insertContent("<p></p>").run();
        }
      } else {
        console.log("upload failed", upload.statusText);
      }
    },
    [editor]
  );
  return (
    <>
      {editor && (
        <>
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              strike
            </button>
          </BubbleMenu>

          <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
            >
              h1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }
            >
              h2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              bullet list
            </button>
            <input
              type="file"
              accept="image/*"
              className={styles.imageInput}
              onChange={(e) => addImage(e.target.files)}
            />
            <input
              type="file"
              className={styles.imageInput}
              onChange={(e) => addFile(e.target.files)}
            />
          </FloatingMenu>
        </>
      )}

      <EditorContent editor={editor} />
    </>
  );
};

export default TiptapEditor;
