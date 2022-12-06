import { FC, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Select } from "@illa-design/react"
import { ActionEventHandler } from "@/page/App/components/Actions/ActionPanel/ActionEventHandler"
import { ResourceChoose } from "@/page/App/components/Actions/ActionPanel/ResourceChoose"
import { TransformerComponent } from "@/page/App/components/Actions/ActionPanel/TransformerComponent"
import {
  getCachedAction,
  getSelectedAction,
} from "@/redux/config/configSelector"
import { configActions } from "@/redux/config/configSlice"
import { ActionItem } from "@/redux/currentApp/action/actionState"
import {
  actionContainerStyle,
  actionItemLabelStyle,
  actionItemStyle,
} from "./style"
import {
  ActionTypeList,
  ActionTypeValue,
  AuthActionTypeValue,
  FirebaseAction,
  FirebaseContentType,
  FirebaseServiceType,
  FirestoreActionTypeValue,
  InitialValue,
} from "@/redux/currentApp/action/firebaseAction"
import { GetUserByIDPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/GetUserByID"
import { GetUserByEmailPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/GetUserByEmail"
import { GetUserByPhonePart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/GetUserByPhone"
import { CreateOneUserPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/CreateOneUser"
import { UpdateOneUserPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/UpdateOneUser"
import { DeleteOneUserPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/DeleteOneUser"
import { ListUsersPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/ListUsers"
import { QueryFirebasePart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/QueryFirebase"
import { InsertDocumentPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/InsertDocument"
import { UpdateDocumentPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/UpdateDocument"
import { GetDocumentByIDPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/GetDocumentByID"
import { DeleteOneDocumentPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/DeleteOneDocument"
import { GetCollectionsPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/GetCollections"
import { QueryCollectionGroupPart } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/QueryCollectionGroup"

export const FirebasePanel: FC = () => {
  const { t } = useTranslation()
  const cachedAction = useSelector(getCachedAction) as ActionItem<
    FirebaseAction<FirebaseContentType>
  >
  const selectedAction = useSelector(getSelectedAction) as ActionItem<
    FirebaseAction<FirebaseContentType>
  >
  const content = cachedAction.content as FirebaseAction<FirebaseContentType>
  const dispatch = useDispatch()

  const handleValueChange = useCallback(
    (value: string, name: string) => {
      let options: FirebaseContentType = content.options
      const selectedContent =
        selectedAction.content as FirebaseAction<FirebaseContentType>
      if (
        cachedAction.resourceId === selectedAction.resourceId &&
        (selectedContent.service === value ||
          selectedContent.operation === value)
      ) {
        options = selectedContent.options
      } else {
        if (name === "operation") {
          options = InitialValue[value as ActionTypeValue]
        }
      }
      dispatch(
        configActions.updateCachedAction({
          ...cachedAction,
          content: {
            ...cachedAction.content,
            [name]: value,
            options,
          },
        }),
      )
    },
    [dispatch, cachedAction, content],
  )

  const renderInputBody = useMemo(() => {
    const props = {
      options: content.options,
    }
    switch (content.operation) {
      case AuthActionTypeValue.GET_USER_BY_UID:
        return <GetUserByIDPart {...props} />
      case AuthActionTypeValue.GET_USER_BY_EMAIL:
        return <GetUserByEmailPart {...props} />
      case AuthActionTypeValue.GET_USER_BY_PHONE:
        return <GetUserByPhonePart {...props} />
      case AuthActionTypeValue.CREATE_ONE_USER:
        return <CreateOneUserPart {...props} />
      case AuthActionTypeValue.UPDATE_ONE_USER:
        return <UpdateOneUserPart {...props} />
      case AuthActionTypeValue.DELETE_ONE_USER:
        return <DeleteOneUserPart {...props} />
      case AuthActionTypeValue.LIST_USERS:
        return <ListUsersPart {...props} />
      case FirestoreActionTypeValue.QUERY_FIREBASE:
        return <QueryFirebasePart {...props} />
      case FirestoreActionTypeValue.INSERT_DOCUMENT:
        return <InsertDocumentPart {...props} />
      case FirestoreActionTypeValue.UPDATE_DOCUMENT:
        return <UpdateDocumentPart {...props} />
      case FirestoreActionTypeValue.GET_DOCUMENT_BY_ID:
        return <GetDocumentByIDPart {...props} />
      case FirestoreActionTypeValue.DELETE_ONE_DOCUMENT:
        return <DeleteOneDocumentPart {...props} />
      case FirestoreActionTypeValue.GET_COLLECTIONS:
        return <GetCollectionsPart {...props} />
      case FirestoreActionTypeValue.QUERY_COLLECTION_GROUP:
        return <QueryCollectionGroupPart {...props} />
    }
  }, [content])

  return (
    <div css={actionContainerStyle}>
      <ResourceChoose />
      <div css={actionItemStyle}>
        <span css={actionItemLabelStyle}>
          {t("editor.action.panel.firebase.service_type")}
        </span>
        <Select
          colorScheme="techPurple"
          showSearch={true}
          defaultValue={content.service}
          value={content.service}
          ml="16px"
          width="100%"
          onChange={(value) => handleValueChange(value, "service")}
          options={FirebaseServiceType}
        />
      </div>
      <div css={actionItemStyle}>
        <span css={actionItemLabelStyle}>
          {t("editor.action.panel.firebase.action_type")}
        </span>
        <Select
          colorScheme="techPurple"
          showSearch={true}
          defaultValue={content.operation}
          value={content.operation}
          ml="16px"
          width="100%"
          placeholder={t(
            "editor.action.panel.firebase.placeholder.select_an_action",
          )}
          onChange={(value) => handleValueChange(value, "operation")}
          options={ActionTypeList[content.service]}
        />
      </div>
      {renderInputBody}
      <TransformerComponent />
      <ActionEventHandler />
    </div>
  )
}

FirebasePanel.displayName = "FirebasePanel"
