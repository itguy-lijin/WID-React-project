import React, {
  createRef,
  unstable_Profiler as Profiler,
  PureComponent,
} from 'react';
import CodeSandboxLink from '../components/CodeSandboxLink';

import styles from './ProfiledExample.module.css';

type Props = {|
  className?: string,
  sandbox?: string,
|};

export default class ProfiledExample extends PureComponent<Props, void> {
  _averageTimeRef = createRef();
  _numCommits = 0;
  _numCommitsRef = createRef();
  _totalActualTime = 0;

  render() {
    const { className, children, sandbox } = this.props;

    return (
      <div className={className}>
        <Profiler id={sandbox || 'Profiler'} onRender={this._onRender}>
          {children}
        </Profiler>
        <div className={styles.Row}>
          <Badge forwardedRef={this._numCommitsRef} label="renders" />
          <CodeSandboxLink sandbox={sandbox} />
          <Badge forwardedRef={this._averageTimeRef} label="average" />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._updateRefs();
  }

  _onRender = (id, phase, actualTime, baseTime) => {
    this._numCommits++;
    this._totalActualTime += actualTime;
    this._updateRefs();
  };

  _updateRefs() {
    if (this._numCommitsRef.current !== null) {
      this._numCommitsRef.current.textContent = this._numCommits;
    }
    if (this._averageTimeRef.current !== null) {
      this._averageTimeRef.current.textContent = `${Math.round(
        this._totalActualTime / this._numCommits * 10
      ) / 10}ms`;
    }
  }
}

const Badge = ({ forwardedRef, label }) => (
  <div className={styles.Badge}>
    <small className={styles.Label}>{label}</small>
    <span className={styles.Count} ref={forwardedRef} />
  </div>
);
