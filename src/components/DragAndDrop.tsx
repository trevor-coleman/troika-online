import React, { Component, PropsWithChildren } from 'react';

interface IDragAndDropProps {
  handleDrop: (files: FileList) => void;
}

interface IDragAndDropState {
  drag: boolean,
  errorMessage: string | null
}

type DragAndDropProps = PropsWithChildren<IDragAndDropProps>

class DragAndDrop extends Component<DragAndDropProps, IDragAndDropState> {
  dragCounter: number = 0;

  state = {
    drag: false,
    errorMessage: null,
  };
  dropRef = React.createRef<HTMLDivElement>();
  handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e?.dataTransfer?.items && e.dataTransfer.items.length == 1) {
      const {items} = e.dataTransfer;
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (items[0] && !acceptedImageTypes.includes(items[0].type)) {
        this.setState({
          drag: true,
          errorMessage: "Wrong Type",
        });
        return;
      }
      this.setState({
        drag: true,
        errorMessage: null,
      });
    }
    if (e?.dataTransfer?.items && e.dataTransfer.items.length > 1) {
      this.setState({
        drag: true,
        errorMessage: "One image only",
      });
    }
    this.setState({drag: true});
  };
  handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({drag: false});
    }
  };
  handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const error = Boolean(this.state.errorMessage);
    this.setState({drag: false, errorMessage:null});
    if(error) return;
    if (e?.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  componentDidMount() {
    let div = this.dropRef.current;
    if (!div) return;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    if (!div) return;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  render() {
    return (
        <div style={{
          display: 'inline-block',
          position: 'relative',
        }}
             ref={this.dropRef}>
          {this.state.drag && <div style={{
            border: 'dashed grey 4px',
            backgroundColor: 'rgba(255,255,255,.8)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: 'grey',
                fontSize: 36,
              }}>
                  <div>{this.state.errorMessage ?? "Upload Image"}</div>
              </div>
          </div>}
          {this.props.children}
        </div>);
  }
}

export default DragAndDrop;
