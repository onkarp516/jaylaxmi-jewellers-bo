import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createUserRole,
  getSysAllPermissions,
  getSysActions,
} from "@/services/api_function";
import Select from "react-select";
import save_icon from "@/assets/images/save_icon.svg";
import LayoutCustom from "@/pages/layout/LayoutCustom";
import {
  eventBus,
  MyNotifications,
  ledger_select,
  OnlyAlphabets,
  WithUserPermission,
  isActionExist,
} from "@/helpers";

class RoleCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      InitVal: {
        roleName: "",
      },
      roleName: "",
      userPermission: [],
      actionsOptions: [],
      sysPermission: [],
      orgSysPermission: [],
    };
    this.ref = React.createRef();
  }

  lstSysActionsOptions = () => {
    // console.log("inside lstSysActionsOptions");
    getSysActions()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          let opt = data.map((v) => {
            return { label: v.name, value: v.id, ...v };
          });
          if (opt.length > 0) {
            this.setState({ actionsOptions: opt });
          }
        }
      })
      .catch((error) => {});
  };

  listSysPermission = () => {
    // console.log("inside listSysPermission");
    getSysAllPermissions()
      .then((response) => {
        let res = response.data;
        let fdata = [];
        if (res.responseStatus == 200) {
          let data = res.level;
          data.map((v) => {
            let check = fdata.find((vi) => vi.id == v.id);
            let d;
            if (check) {
              d = {
                id: v.id,
                level: [
                  ...check.level,
                  {
                    id: v.level.id,
                    actions: v.level.actions,
                    name: v.level.name,
                    value: v.level.id,
                    label: v.level.name,
                  },
                ],
                name: v.name,
                value: v.id,
                label: v.name,
              };
              fdata = fdata.filter((vi) => vi.id != v.id);
            } else {
              d = {
                id: v.id,
                level: [
                  {
                    id: v.level.id,
                    actions: v.level.actions,
                    name: v.level.name,
                    value: v.level.id,
                    label: v.level.name,
                  },
                ],
                name: v.name,
                value: v.id,
                label: v.name,
              };
            }
            fdata = [...fdata, d];
          });
          // console.log("fdata", fdata);
          fdata = fdata.sort((a, b) => (a.id < b.id ? -1 : 1));
          this.setState({
            sysPermission: fdata,
            orgSysPermission: fdata,
          });
        } else {
          this.setState({ sysPermission: [], orgSysPermission: [] });
        }
      })
      .catch((error) => {
        this.setState({ sysPermission: [] });
        console.log("error", error);
      });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  handleUserSelection = (
    parent_id,
    child_id = 0,
    action_id = 0,
    status = false
  ) => {
    let { userPermission, sysPermission } = this.state;
    let filterUserPermission = [];
    let fuserPermissions = [];
    if (child_id == 0 && action_id == 0) {
      // alert("this")
      let f = sysPermission.find((v) => parseInt(v.id) == parseInt(parent_id));
      if (status == true) {
        let modules = [];
        if (f.level) {
          modules = f.level.map((vi) => {
            return { mapping_id: vi.id, actions: vi.actions };
          });
        }
        let d = {
          id: f.id,
          name: f.name,
          modules: modules,
        };
        // fuserPermissions.push(d);
        fuserPermissions = [...fuserPermissions, d];

        if (userPermission.length > 0) {
          filterUserPermission = userPermission.filter(
            (v) => parseInt(v.id) != parseInt(f.id)
          );
        }
        fuserPermissions = [...fuserPermissions, ...filterUserPermission];
      } else {
        if (userPermission.length > 0) {
          filterUserPermission = userPermission.filter(
            (v) => parseInt(v.id) != parseInt(f.id)
          );
        }
        fuserPermissions = filterUserPermission;
      }

      this.setState({ userPermission: fuserPermissions });
    } else if (action_id == 0) {
      if (status == true) {
        let f = sysPermission.find(
          (v) => parseInt(v.id) == parseInt(parent_id)
        );
        if (userPermission.length == 0) {
          let check = f.level.find(
            (v) => parseInt(v.value) == parseInt(child_id)
          );
          let modules = [];
          if (check) {
            modules.push({ mapping_id: check.id, actions: check.actions });
          }
          let d = {
            id: f.id,
            name: f.name,
            modules: modules,
          };
          // fuserPermissions.push(d);
          fuserPermissions = [...fuserPermissions, d];
        } else {
          // !IMP
          fuserPermissions = [...userPermission];
          let checkinner = userPermission.find(
            (v) => parseInt(v.id) == parseInt(parent_id)
          );

          if (checkinner) {
            let modules = [];
            // !IMP
            modules = checkinner.modules.filter(
              (v) => parseInt(v.mapping_id) != parseInt(child_id)
            );

            let Syscheck = f.level.find(
              (v) => parseInt(v.value) == parseInt(child_id)
            );

            if (Syscheck) {
              modules.push({
                mapping_id: Syscheck.id,
                actions: Syscheck.actions,
              });
            }
            let d = {
              id: f.id,
              name: f.name,
              modules: modules,
            };

            if (userPermission.length > 0) {
              filterUserPermission = userPermission.filter(
                (v) => parseInt(v.id) != parseInt(parent_id)
              );
            }
            fuserPermissions = [
              //! ...fuserPermissions,
              ...filterUserPermission,
              d,
            ];
          } else {
            let check = f.level.find(
              (v) => parseInt(v.value) == parseInt(child_id)
            );
            let modules = [];
            if (check) {
              modules.push({ mapping_id: check.id, actions: check.actions });
            }
            let d = {
              id: f.id,
              name: f.name,
              modules: modules,
            };
            if (userPermission.length > 0) {
              filterUserPermission = userPermission.filter(
                (v) => parseInt(v.id) != parseInt(parent_id)
              );
            }
            fuserPermissions = [
              ...fuserPermissions,
              ...filterUserPermission,
              d,
            ];
          }
        }
      } else {
        let checkinner = userPermission.find(
          (v) => parseInt(v.id) == parseInt(parent_id)
        );
        if (checkinner) {
          let check = checkinner.modules.filter(
            (v) => parseInt(v.mapping_id) !== parseInt(child_id)
          );
          let incheck = {
            id: checkinner.id,
            name: checkinner.name,
            modules: check,
          };
          let fcheckinner = userPermission.filter(
            (v) => parseInt(v.id) !== parseInt(parent_id)
          );
          fuserPermissions = [...fcheckinner, incheck];
        }
      }

      this.setState({ userPermission: fuserPermissions });
    } else {
      if (userPermission.length > 0) {
        if (status == true) {
          let checkinner = userPermission.find((v) => v.id == parent_id);
          let scheck = [];
          if (checkinner) {
            let check = checkinner.modules.find(
              (v) => parseInt(v.mapping_id) == parseInt(child_id)
            );
            if (check) {
              let actions = [...check.actions, action_id];
              check.actions = actions;
              let fcheck = checkinner.modules.filter(
                (v) => parseInt(v.mapping_id) !== parseInt(child_id)
              );
              scheck = [...fcheck, check];
              let incheck = {
                id: checkinner.id,
                name: checkinner.name,
                modules: scheck,
              };
              let fcheckinner = userPermission.filter(
                (v) => parseInt(v.id) !== parseInt(parent_id)
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
              this.setState({ userPermission: fuserPermissions });
            } else {
              let f = sysPermission.find(
                (v) => parseInt(v.id) == parseInt(parent_id)
              );
              let check = f.level.find(
                (v) => parseInt(v.value) == parseInt(child_id)
              );
              let modules = [...checkinner.modules];
              modules.push({ mapping_id: check.id, actions: [action_id] });
              let incheck = {
                id: f.id,
                name: f.name,
                modules: modules,
              };
              let fcheckinner = userPermission.filter(
                (v) => parseInt(v.id) !== parseInt(parent_id)
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];

              this.setState({ userPermission: fuserPermissions });
            }
          } else {
            let f = sysPermission.find(
              (v) => parseInt(v.id) == parseInt(parent_id)
            );
            if (f) {
              let check = f.level.find(
                (v) => parseInt(v.value) == parseInt(child_id)
              );
              let modules = [];
              if (check) {
                modules.push({ mapping_id: check.id, actions: [action_id] });
              }
              if (check) {
                let d = {
                  id: f.id,
                  name: f.name,
                  modules: modules,
                };
                fuserPermissions = [d];
              }
              fuserPermissions = [...fuserPermissions, ...userPermission];
              this.setState({ userPermission: fuserPermissions });
            }
          }
        } else {
          let checkinner = userPermission.find(
            (v) => parseInt(v.id) == parseInt(parent_id)
          );
          let scheck = [];
          if (checkinner) {
            let check = checkinner.modules.find(
              (v) => parseInt(v.mapping_id) == parseInt(child_id)
            );
            if (check) {
              let actions = check.actions.filter(
                (v) => parseInt(v) != parseInt(action_id)
              );
              // let actions = [...check.actions, action_id];
              check.actions = actions;
              let fcheck = checkinner.modules.filter(
                (v) => parseInt(v.mapping_id) !== parseInt(child_id)
              );

              scheck = [...fcheck, check];
              let incheck = {
                id: checkinner.id,
                name: checkinner.name,
                modules: scheck,
              };
              let fcheckinner = userPermission.filter(
                (v) => parseInt(v.id) !== parseInt(parent_id)
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
              this.setState({ userPermission: fuserPermissions });
            }
          }
        }
      } else {
        if (status == true) {
          let f = sysPermission.find(
            (v) => parseInt(v.id) == parseInt(parent_id)
          );
          if (f) {
            let check = f.level.find(
              (v) => parseInt(v.value) == parseInt(child_id)
            );
            let modules = [];
            if (check) {
              modules.push({ mapping_id: check.id, actions: [action_id] });
            }
            if (check) {
              let d = {
                id: f.id,
                name: f.name,
                modules: modules,
              };
              fuserPermissions = [d];
            }
            this.setState({ userPermission: fuserPermissions });
          }
        } else {
          this.setState({ userPermission: [] });
        }
      }
    }
  };

  // handleUserSelection = (
  //   parent_id,
  //   child_id = 0,
  //   action_id = 0,
  //   status = false
  // ) => {
  //   let { userPermission, sysPermission } = this.state;
  //   let filterRolePermission = [];
  //   let fuserPermission = [];
  //   if (child_id == 0 && action_id == 0) {
  //     let f = sysPermission.find((v) => v.id == parent_id);
  //     if (status == true) {
  //       let modules = [];
  //       if (f.level) {
  //         modules = f.level.map((vi) => {
  //           return { mapping_id: vi.id, actions: vi.actions };
  //         });
  //       }
  //       let d = {
  //         id: f.id,
  //         name: f.name,
  //         modules: modules,
  //       };
  //       fuserPermission.push(d);

  //       if (userPermission.length > 0) {
  //         filterRolePermission = userPermission.filter((v) => v.id != f.id);
  //       }
  //       fuserPermission = [...fuserPermission, ...filterRolePermission];
  //     } else {
  //       if (userPermission.length > 0) {
  //         filterRolePermission = userPermission.filter((v) => v.id != f.id);
  //       }
  //       fuserPermission = filterRolePermission;
  //     }

  //     this.setState({ userPermission: fuserPermission });
  //   } else if (action_id == 0) {
  //     if (status == true) {
  //       let f = sysPermission.find((v) => v.id == parent_id);
  //       if (userPermission.length == 0) {
  //         let check = f.level.find((v) => v.value == child_id);
  //         let modules = [];
  //         if (check) {
  //           modules.push({ mapping_id: check.id, actions: check.actions });
  //         }
  //         let d = {
  //           id: f.id,
  //           name: f.name,
  //           modules: modules,
  //         };
  //         fuserPermission.push(d);
  //       } else {
  //         let checkinner = userPermission.find((v) => v.id == parent_id);
  //         if (checkinner) {
  //           let modules = [];
  //           modules = checkinner.modules;
  //           let Syscheck = f.level.find((v) => v.value == child_id);
  //           if (Syscheck) {
  //             modules.push({
  //               mapping_id: Syscheck.id,
  //               actions: Syscheck.actions,
  //             });
  //           }
  //           let d = {
  //             id: f.id,
  //             name: f.name,
  //             modules: modules,
  //           };
  //           if (userPermission.length > 0) {
  //             filterRolePermission = userPermission.filter(
  //               (v) => v.id != parent_id
  //             );
  //           }
  //           fuserPermission = [
  //             ...fuserPermission,
  //             ...filterRolePermission,
  //             d,
  //           ];
  //         } else {
  //           let check = f.level.find((v) => v.value == child_id);
  //           let modules = [];
  //           if (check) {
  //             modules.push({ mapping_id: check.id, actions: check.actions });
  //           }
  //           let d = {
  //             id: f.id,
  //             name: f.name,
  //             modules: modules,
  //           };
  //           if (userPermission.length > 0) {
  //             filterRolePermission = userPermission.filter(
  //               (v) => v.id != parent_id
  //             );
  //           }
  //           fuserPermission = [
  //             ...fuserPermission,
  //             ...filterRolePermission,
  //             d,
  //           ];
  //         }
  //       }
  //     } else {
  //       let checkinner = userPermission.find((v) => v.id == parent_id);
  //       if (checkinner) {
  //         let check = checkinner.modules.filter(
  //           (v) => v.mapping_id !== child_id
  //         );
  //         let incheck = {
  //           id: checkinner.id,
  //           name: checkinner.name,
  //           modules: check,
  //         };
  //         let fcheckinner = userPermission.filter((v) => v.id !== parent_id);
  //         fuserPermission = [...fcheckinner, incheck];
  //       }
  //     }

  //     this.setState({ userPermission: fuserPermission });
  //   } else {
  //     if (userPermission.length > 0) {
  //       if (status == true) {
  //         let checkinner = userPermission.find((v) => v.id == parent_id);
  //         let scheck = [];
  //         if (checkinner) {
  //           let check = checkinner.modules.find(
  //             (v) => v.mapping_id == child_id
  //           );
  //           if (check) {
  //             let actions = [...check.actions, action_id];
  //             check.actions = actions;
  //             let fcheck = checkinner.modules.filter(
  //               (v) => v.mapping_id !== child_id
  //             );
  //             scheck = [...fcheck, check];
  //             let incheck = {
  //               id: checkinner.id,
  //               name: checkinner.name,
  //               modules: scheck,
  //             };
  //             let fcheckinner = userPermission.filter(
  //               (v) => v.id !== parent_id
  //             );
  //             fuserPermission = [...fuserPermission, ...fcheckinner, incheck];
  //             this.setState({ userPermission: fuserPermission });
  //           } else {
  //             let f = sysPermission.find((v) => v.id == parent_id);
  //             let check = f.level.find((v) => v.value == child_id);
  //             let modules = [...checkinner.modules];
  //             modules.push({ mapping_id: check.id, actions: [action_id] });
  //             let incheck = {
  //               id: f.id,
  //               name: f.name,
  //               modules: modules,
  //             };
  //             let fcheckinner = userPermission.filter(
  //               (v) => v.id !== parent_id
  //             );
  //             fuserPermission = [...fuserPermission, ...fcheckinner, incheck];

  //             this.setState({ userPermission: fuserPermission });
  //           }
  //         } else {
  //           let f = sysPermission.find((v) => v.id == parent_id);
  //           if (f) {
  //             let check = f.level.find((v) => v.value == child_id);
  //             let modules = [];
  //             if (check) {
  //               modules.push({ mapping_id: check.id, actions: [action_id] });
  //             }
  //             if (check) {
  //               let d = {
  //                 id: f.id,
  //                 name: f.name,
  //                 modules: modules,
  //               };
  //               fuserPermission = [d];
  //             }
  //             fuserPermission = [...fuserPermission, ...userPermission];
  //             this.setState({ userPermission: fuserPermission });
  //           }
  //         }
  //       } else {
  //         let checkinner = userPermission.find((v) => v.id == parent_id);
  //         let scheck = [];
  //         if (checkinner) {
  //           let check = checkinner.modules.find(
  //             (v) => v.mapping_id == child_id
  //           );
  //           if (check) {
  //             let actions = check.actions.filter(
  //               (v) => parseInt(v) != parseInt(action_id)
  //             );
  //             // let actions = [...check.actions, action_id];
  //             check.actions = actions;
  //             let fcheck = checkinner.modules.filter(
  //               (v) => v.mapping_id !== child_id
  //             );

  //             scheck = [...fcheck, check];
  //             let incheck = {
  //               id: checkinner.id,
  //               name: checkinner.name,
  //               modules: scheck,
  //             };
  //             let fcheckinner = userPermission.filter(
  //               (v) => v.id !== parent_id
  //             );
  //             fuserPermission = [...fuserPermission, ...fcheckinner, incheck];
  //             this.setState({ userPermission: fuserPermission });
  //           }
  //         }
  //       }
  //     } else {
  //       if (status == true) {
  //         let f = sysPermission.find((v) => v.id == parent_id);
  //         if (f) {
  //           let check = f.level.find((v) => v.value == child_id);
  //           let modules = [];
  //           if (check) {
  //             modules.push({ mapping_id: check.id, actions: [action_id] });
  //           }
  //           if (check) {
  //             let d = {
  //               id: f.id,
  //               name: f.name,
  //               modules: modules,
  //             };
  //             fuserPermission = [d];
  //           }
  //           this.setState({ userPermission: fuserPermission });
  //         }
  //       } else {
  //         this.setState({ userPermission: [] });
  //       }
  //     }
  //   }
  // };

  componentDidMount() {
    this.listSysPermission();
    // this.listGetCompany();
    // this.listGetBranch();
    this.setInitValue();
    this.lstSysActionsOptions();
    // if (AuthenticationCheck()) {

    //   mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
    //   mousetrap.bindGlobal("ctrl+c", this.setInitValue);
    // }
  }

  componentWillUnmount() {
    // mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    // mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  setInitValue = () => {
    this.ref.current.resetForm();
    this.setState({
      InitVal: {
        roleName: "",
      },
      roleName: "",
      userPermission: [],
      actionsOptions: [],
      sysPermission: [],
      orgSysPermission: [],
    });
  };

  getActionSelectionOption = (mapping_id, action_id) => {
    let { userPermission } = this.state;
    let res = false;
    userPermission.map((v) => {
      if (v.mapping_id == mapping_id) {
        if (v.actions.includes(action_id)) {
          res = true;
        }
      }
    });

    return res;
  };

  getSelectAllOption = (mapping_id) => {
    let { userPermission, orgSysPermission } = this.state;
    let res = false;
    let obj = orgSysPermission.find((v) => v.id == mapping_id);
    let action_ids = obj.actions.map((vi) => {
      return vi.id;
    });

    userPermission.map((v) => {
      if (v.mapping_id == mapping_id) {
        if (action_ids.length == v.actions.length) {
          res = true;
        }
      }
    });

    return res;
  };

  validationSchema = () => {
    return Yup.object().shape({
      roleName: Yup.string()
        .nullable()
        .trim()
        .required("Role name is required"),
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  isParentChecked = (parent_id) => {
    let { sysPermission, userPermission } = this.state;
    let res = false;

    let sysParentExist = sysPermission.find(
      (v) => parseInt(v.id) === parseInt(parent_id)
    );
    let userParentExist = userPermission.find(
      (v) => parseInt(v.id) === parseInt(parent_id)
    );
    if (sysParentExist && userParentExist) {
      let resArr = [];
      if (sysParentExist.level.length == userParentExist.modules.length) {
        userParentExist.modules.map((v) => {
          let r = this.isChildchecked(parent_id, v.mapping_id);
          resArr.push(r);
        });
      }
      if (resArr.length > 0 && !resArr.includes(false)) {
        res = true;
      }
    }
    return res;
  };

  isChildchecked = (parent_id, child_id) => {
    let { sysPermission, userPermission } = this.state;
    let res = false;
    let sysParentExist = sysPermission.find(
      (v) => parseInt(v.id) === parseInt(parent_id)
    );

    let userParentExist = userPermission.find(
      (v) => parseInt(v.id) === parseInt(parent_id)
    );

    if (sysParentExist && userParentExist) {
      let sysChildExist = sysParentExist.level.find(
        (v) => parseInt(v.id) === parseInt(child_id)
      );
      let userChildExist = userParentExist.modules.find(
        (v) => parseInt(v.mapping_id) === parseInt(child_id)
      );
      if (sysChildExist && userChildExist) {
        if (sysChildExist.actions.length == userChildExist.actions.length) {
          res = true;
        }
      }
    }

    return res;
  };

  getActionOptionChecked(parent_id, child_id, action_id) {
    let { userPermission } = this.state;
    let res = false;
    let parentExist = userPermission.find((v) => v.id == parent_id);
    if (parentExist) {
      let childExist = parentExist.modules.find(
        (vi) => parseInt(vi.mapping_id) == parseInt(child_id)
      );
      if (childExist) {
        let childInnerExist = childExist.actions.find(
          (v) => parseInt(v) == parseInt(action_id)
        );
        if (childInnerExist) {
          res = true;
        }
      }
    }
    // console.log({ parent_id, child_id, action_id });
    return res;
  }

  checkModuleActions = (id, actions) => {
    let actAction = actions.map((v) => parseInt(v));
    return actAction.includes(id);
  };
  render() {
    const {
      opCompanyList,
      InitVal,
      sysPermission,
      userPermission,
      opBranchList,
      listGetBranch,
      parent,
      level,
      actionsOptions,
    } = this.state;

    // console.log("userPermission Render==-->", userPermission);
    // console.log("userPermission Render==-->", JSON.stringify(userPermission));
    return (
      <LayoutCustom>
        <div className="">
          <div id="example-collapse-text" className="usercreatestyle">
            <div className="m-0">
              {/* <h4 className="form-header">Create User</h4> */}
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                enableReinitialize={true}
                initialValues={InitVal}
                innerRef={this.ref}
                validationSchema={this.validationSchema()}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  console.log("values", values);
                  let requestData = new FormData();
                  let keys = Object.keys(InitVal);
                  requestData.append("roleName", values.roleName);
                  let userPermission = [];
                  let mdlids = [];
                  if (
                    this.state.userPermission && 
                    this.state.userPermission.length > 0
                  ) {
                    this.state.userPermission.map((v) => {
                      v.modules.map((vi)=>{
                        if(!mdlids.includes(parseInt(vi.mapping_id))){
                          userPermission.push(vi);
                          mdlids.push(parseInt(vi.mapping_id));
                        }
                      })
                      // userPermission.push(...v.modules);
                    });
                  }
                  // console.log("🚀 ~ file: RoleCreate.jsx:857 ~ RoleCreate ~ render ~ userPermission:", userPermission)
                  requestData.append(
                    "roles_permissions",
                    JSON.stringify(userPermission)
                  );
                  // console.log("response user per---", requestData);
                  // Display the key/value pairs
                  for (var pair of requestData.entries()) {
                    console.log(pair[0] + ", " + pair[1]);
                  }
                  // return false
                  createUserRole(requestData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        console.log(res.message);
                        // this.setState({ isLoading: false });
                        toast.success("✔" + res.message, {
                          onClose: () =>
                            this.props.history.push("/master/role", true),
                        });
                        setSubmitting(false);
                      } else {
                        setSubmitting(false);
                        this.setState({ isLoading: false });
                        toast.error("✘ " + res.message);
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      console.log("error", error);
                    });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <div>
                      <Row>
                        <Col md="12">
                          <Card className="detailsstyle">
                            <Card.Body>
                              <p className="cardheading mb-0">
                                Create User Role:
                              </p>
                              <Row>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label
                                      style={{
                                        fontFamily: "Inter",
                                        fontStyle: "normal",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                        lineHeight: "17px",
                                        alignItems: "center",
                                        letterSpacing: "-0.02em",
                                        color: "#000000",
                                      }}
                                    >
                                      Role Name
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="roleName"
                                      name="roleName"
                                      className="text-box"
                                      placeholder="Enter Role Name"
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                      value={values.roleName}
                                    />
                                  </Form.Group>
                                  <span className="text-danger">
                                    {errors.roleName && errors.roleName}
                                  </span>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      <Row className="px-2 mt-4">
                        <Col md="12" className="mb-3">
                          <Row>
                            <Col md="2">
                              <p className="cardheading mb-0">
                                Access Permissions:
                              </p>
                            </Col>
                            <Col md="6"></Col>
                            <Col md="2"></Col>
                            <Col md="2"></Col>
                          </Row>
                        </Col>
                      </Row>
                      <div className="px-2 tblht">
                        <Table bordered className="usertblbg tblresponsive">
                          <thead style={{ position: "sticky", top: "0" }}>
                            <tr>
                              <th
                                style={{
                                  borderBottom: "2px solid transparent",
                                  backgroundColor: "#fff4df",
                                }}
                              >
                                Particulars
                              </th>
                              {/* This Th-Map For Table header like Create,Edit,View */}
                              {actionsOptions &&
                                actionsOptions.length > 0 &&
                                actionsOptions.map((v, i) => {
                                  return (
                                    <th
                                      className="text-center"
                                      style={{
                                        borderBottom: "2px solid transparent",
                                        backgroundColor: "#fff4df",
                                      }}
                                    >
                                      {v.label}
                                    </th>
                                  );
                                })}
                            </tr>
                          </thead>
                          <tbody className="bg-white tblbtmline ">
                            {/* This Map for Insert Data Into Table Content Parent Names like ->Master With Check Box */}
                            {sysPermission.map((vi, ii) => {
                              return (
                                <>
                                  <tr>
                                    <td
                                      className="text-center"
                                      style={{ background: "#e6f2f8" }}
                                    >
                                      {vi && vi.label != "" && (
                                        <>
                                          <Form.Group className="d-flex my-auto p-2">
                                            <Form.Check
                                              type={"checkbox"}
                                              id={`check-api-${ii}`}
                                            >
                                              <Form.Check.Input
                                                type={"checkbox"}
                                                defaultChecked={false}
                                                name="level1"
                                                checked={this.isParentChecked(
                                                  vi.id
                                                )}
                                                onChange={(e) => {
                                                  this.handleUserSelection(
                                                    vi.id,
                                                    0,
                                                    0,
                                                    e.target.checked
                                                  );
                                                }}
                                                //   value={this.getActionSelectionOption(
                                                //     values,
                                                //     v.value
                                                //   )}
                                              />
                                              <Form.Check.Label
                                                style={{
                                                  color: "#00a0f5",
                                                  textDecoration: "underline",
                                                }}
                                              >
                                                {vi.label}
                                              </Form.Check.Label>
                                            </Form.Check>
                                          </Form.Group>
                                        </>
                                      )}
                                    </td>
                                    {/* This Map Used for Insert Data of child Under Master */}
                                    {actionsOptions &&
                                      actionsOptions.length > 0 &&
                                      actionsOptions.map((v, i) => {
                                        return (
                                          <td
                                            style={{
                                              background: "#e6f2f8",
                                              width: "10%",
                                            }}
                                          ></td>
                                        );
                                      })}
                                  </tr>
                                  {vi.level &&
                                    vi.level.map((vii, iii) => {
                                      return (
                                        <tr>
                                          <td className="text-center">
                                            {vii && (
                                              <Form.Group className="d-flex my-auto p-2">
                                                <Form.Check
                                                  type={"checkbox"}
                                                  id={`check-api-${ii}-${iii}`}
                                                >
                                                  <Form.Check.Input
                                                    type={"checkbox"}
                                                    defaultChecked={false}
                                                    name="level1"
                                                    checked={this.isChildchecked(
                                                      vi.id,
                                                      vii.id
                                                    )}
                                                    onChange={(e) => {
                                                      this.handleUserSelection(
                                                        vi.id,
                                                        vii.id,
                                                        0,
                                                        e.target.checked
                                                      );
                                                    }}
                                                    value={vii.id}
                                                  />
                                                  <Form.Check.Label>
                                                    {vii.label}
                                                  </Form.Check.Label>
                                                </Form.Check>
                                              </Form.Group>
                                            )}
                                          </td>
                                          {/* This Map Used For Load Actions of Child With Check Box Control */}
                                          {actionsOptions &&
                                            actionsOptions.map((va, vai) => {
                                              return (
                                                <td>
                                                  {this.checkModuleActions(
                                                    va.id,
                                                    vii.actions
                                                  ) && (
                                                    <Form.Group className="d-flex">
                                                      <Form.Check
                                                        className="mx-auto"
                                                        type={"checkbox"}
                                                        id={`check-api-${vai}`}
                                                      >
                                                        <Form.Check.Input
                                                          type={"checkbox"}
                                                          defaultChecked={false}
                                                          name="inner_level"
                                                          checked={this.getActionOptionChecked(
                                                            vi.id,
                                                            vii.id,
                                                            va.id
                                                          )}
                                                          onChange={(e) => {
                                                            this.handleUserSelection(
                                                              vi.id,
                                                              vii.id,
                                                              va.id,
                                                              e.target.checked
                                                            );
                                                          }}
                                                          value={va}
                                                        />
                                                        <Form.Check.Label>
                                                          {/* {vii.label} */}
                                                        </Form.Check.Label>
                                                      </Form.Check>
                                                    </Form.Group>
                                                  )}
                                                </td>
                                              );
                                            })}
                                        </tr>
                                      );
                                    })}
                                </>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                      <Row className="mt-4 mb-4">
                        <Col md="12">
                          <ButtonGroup
                            className="float-end"
                            aria-label="Basic example"
                          >
                            <Button
                              className="successbtn-style ms-2"
                              type="submit"
                              style={{ marginRight: "10px" }}
                            >
                              <img
                                src={save_icon}
                                className="me-2"
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  // marginTop: "-10px",
                                }}
                              />
                              Submit
                            </Button>
                            <Button
                              variant="secondary"
                              className="cancel-btn me-2"
                              onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push(`/master/role`);
                              }}
                            >
                              Cancel
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </LayoutCustom>
    );
  }
}

export default WithUserPermission(RoleCreate);
