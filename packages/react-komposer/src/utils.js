import hoistStatics from 'hoist-non-react-statics'

export function inheritStatics (Container, ChildComponent) {
  const childDisplayName = ChildComponent.displayName || ChildComponent.name || 'ChildComponent'

  Container.displayName = `Container(${childDisplayName})`

  return hoistStatics(Container, ChildComponent)
}

export function isStateless ({ prototype }) {
  return !(prototype && prototype.render)
}
