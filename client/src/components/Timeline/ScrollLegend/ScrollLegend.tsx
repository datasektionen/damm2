import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IEventsPerYear } from '../../../types/definitions';
import { StyledScrollLegend, Year, Scroller } from './style';

interface Props {
    years: IEventsPerYear[];
}

interface State {
    scrollTop: number;
    positions: any;
    documentHeight: number;
    year: number;
}

export class ScrollLegend extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            scrollTop: Math.max(document.body.scrollTop, document.documentElement.scrollTop),
            year: 1983,
            positions: {},
            documentHeight: 1,
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const init = () => {
            this.updatePositions()
            document.body.onscroll = _ => this.onScroll()
            this.onScroll()
            this.makeScrollHandleDraggable()
            this.initTouchHandlers()
        }
        window.onresize = function (event: any) {
            init()
        }
        setTimeout(init, 500)
    }

    initTouchHandlers() {
        const touchHandler = (event: any) => {
            const touches = event.changedTouches
            const first = touches[0]
            let type = ""

            switch (event.type) {
                case "touchstart": type = "mousedown"; break;
                case "touchmove": type = "mousemove"; break;
                case "touchend": type = "mouseup"; break;
                default: return;
            }

            const simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                first.clientX, first.clientY, false,
                false, false, false, 0, null);

            if (first.target.id !== "YearScroller") return
            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
        }

        document.addEventListener("touchstart", touchHandler, true)
        document.addEventListener("touchmove", touchHandler, true)
        document.addEventListener("touchend", touchHandler, true)
        document.addEventListener("touchcancel", touchHandler, true)
    }

    makeScrollHandleDraggable() {
        if (!document || !window) {
            return
        }
        const handle = document.getElementById('YearScroller')
        const documentElement = document.documentElement
        if (!handle || !documentElement) {
            return
        }

        let grippingOffset = 0

        const repositionElement = (event: any) => {
            event.stopPropagation()
            event.preventDefault()

            const newScroll = (event.clientY - grippingOffset) / documentElement.clientHeight * (1 / 0.95) * this.state.documentHeight
            window.scrollTo(0, newScroll)
            this.onScroll()
            //   window.onscroll()
        }

        handle.addEventListener('mousedown', event => {
            grippingOffset = event.offsetY
            documentElement.addEventListener('mousemove', repositionElement, false)

            window.addEventListener('mouseup', _ => {
                documentElement.removeEventListener('mousemove', repositionElement, false)
            }, false)
        }, false)
    }

    onScroll() {
        let year: number = 0
        for (let i = 0; i < this.props.years.length - 1; i++) {
            year = this.props.years[i].year
            if (this.state.positions[this.props.years[i + 1].year] - 50 > this.state.scrollTop) {
                break
            }
        }

        this.setState({
            scrollTop: Math.max(
                document.body.scrollTop,
                document.documentElement.scrollTop
            ),
            documentHeight: Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            ),
            year: Number(year)
        })
    }

    /**
     * Update the positions list of the different years.
     * @return void
     */
    updatePositions() {
        // Lambda function for getting position of year
        const position = (year: number) => {
            if (!document || !window) {
                return 0
            }
            const element = document.getElementById('year-' + year)
            if (!element) {
                return 0
            }
            const elementPos = element.getBoundingClientRect().top + window.scrollY
            return elementPos
        }

        // Loop through the years and save their position
        const positions = {} as any
        this.props.years.forEach(year => {
            positions[year.year] = position(year.year)
        })

        this.setState({ positions })
    }

    goTo(year: number) {
        const topBarHeight = 50

        if (!window || !document) {
            return
        }

        const element = document.getElementById('year-' + year)
        if (!element) {
            return
        }

        window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - topBarHeight)
        this.onScroll()
        // window.onscroll()
    }

    render() {

        const { scrollTop, documentHeight, year, positions } = this.state;
        const { years } = this.props

        return (
            <StyledScrollLegend id="ScrollLegend">
                <Scroller
                    position={scrollTop / documentHeight * 95 + "%"}
                    id="YearScroller"
                >
                    {year}
                </Scroller>
                {years?.map(y =>
                    <Year
                        key={"year-" + y.year}
                        onClick={() => this.goTo(y.year)}
                        position={positions[y.year] / documentHeight * 95 + "%"}
                    >
                        {y.year}
                    </Year>
                )}
            </StyledScrollLegend>
        )
    }
}

// export const ScrollLegend: React.FC<Props> = ({ years }) => {

//     const [positions, setPositions] = useState<any>({});
//     const [scrollTop, setScrollTop] = useState<number>(Math.max(document.body.scrollTop, document.documentElement.scrollTop));
//     const [documentHeight, setDocumentHeight] = useState<number>(1);
//     const [year, setYear] = useState("")

//     // const init = () => {
//     //     updatePositions()
//     //     onScroll()
//     //     initTouchHandlers()
//     //     makeScrollHandleDraggable()
//     // }

//     // useEffect(() => {
//     //     document.body.onscroll = () => onScroll()
//     //     window.onresize = function() {
//     //         init()
//     //     }
//     // }, [years])

//     // useEffect(() => {
//     //     init()
//     // }, [])

//     // useEffect(() => {
//     //     onScroll()
//     //     makeScrollHandleDraggable()
//     // })

//     useEffect(() => {
//         updatePositions()
//     }, [])

//     useLayoutEffect(() => {
//         setScrollTop(Math.max(
//             document.body.scrollTop,
//             document.documentElement.scrollTop
//         ))
//         window.addEventListener("scroll", onScroll)
//         onScroll()
//         return () => {
//             window.removeEventListener("scroll", onScroll)
//         }
//     }, [])

//     useLayoutEffect(() => {
//         updatePositions()
//         setDocumentHeight(Math.max(
//             document.body.scrollHeight,
//             document.body.offsetHeight,
//             document.documentElement.clientHeight,
//             document.documentElement.scrollHeight,
//             document.documentElement.offsetHeight
//         ));
//     }, [years])

//     // useEffect(() => {
//     //     const init = async () => {
//     //         updatePositions()
//     //         makeScrollHandleDraggable()
//     //         initTouchHandlers()
//     //         document.body.onscroll = () => onScroll()
//     //         // document.body.onscroll = () => onScroll()
//     //         onScroll()
//     //       }
//     //       window.onresize = function(event: any) {
//     //         init()
//     //       }
//     //       setTimeout(init, 1000)
//     // }, [years])

//     // useEffect(() => {
//     //     document.body.onscroll = () => onScroll()
//     //     onScroll()
//     // }, [positions])

//     // useEffect(() => {
//     //     setTimeout(updatePositions, 500)
//     // }, [])




// // --------------------------------------------------



//     // useEffect(() => {
//     //     updatePositions();
//     //     setDocumentHeight(Math.max(
//     //         document.body.scrollHeight,
//     //         document.body.offsetHeight,
//     //         document.documentElement.clientHeight,
//     //         document.documentElement.scrollHeight,
//     //         document.documentElement.offsetHeight
//     //     ));
//     // }, [years])

//     const initTouchHandlers = () => {
//         const touchHandler = (event: any) => {
//             const touches = event.changedTouches
//             const first = touches[0]
//             let type = ""

//             switch (event.type) {
//                 case "touchstart": type = "mousedown"; break;
//                 case "touchmove": type = "mousemove"; break;
//                 case "touchend": type = "mouseup"; break;
//                 default: return;
//             }

//             const simulatedEvent = document.createEvent("MouseEvent");
//             simulatedEvent.initMouseEvent(type, true, true, window, 1,
//                 first.screenX, first.screenY,
//                 first.clientX, first.clientY, false,
//                 false, false, false, 0, null);

//             if (first.target.id !== "YearScroller") return
//             first.target.dispatchEvent(simulatedEvent);
//             event.preventDefault();
//         }

//         document.addEventListener("touchstart", touchHandler, true)
//         document.addEventListener("touchmove", touchHandler, true)
//         document.addEventListener("touchend", touchHandler, true)
//         document.addEventListener("touchcancel", touchHandler, true)
//     }

//     const makeScrollHandleDraggable = () => {
//         if (!document || !window) {
//             return
//         }
//         const handle = document.getElementById('YearScroller')
//         const documentElement = document.documentElement
//         if (!handle || !documentElement) {
//             return
//         }

//         let grippingOffset = 0

//         const repositionElement = (event: any) => {
//             event.stopPropagation()
//             event.preventDefault()

//             const newScroll = (event.clientY - grippingOffset) / documentElement.clientHeight * (1 / 0.95) * documentHeight
//             window.scrollTo(0, newScroll)
//             // window.onscroll()
//         }

//         handle.addEventListener('mousedown', event => {
//             grippingOffset = event.offsetY
//             documentElement.addEventListener('mousemove', repositionElement, false)

//             window.addEventListener('mouseup', () => {
//                 documentElement.removeEventListener('mousemove', repositionElement, false)
//             }, false)
//         }, false)
//     }

//     const onScroll = () => {
//         console.log(positions)
//         if (Object.keys(positions).length === 0) return;
//         let year = ''
//         for (let i = 0; i < years.length - 1; i++) {
//             year = years[i].year.toString()
//             console.log(years[i+1])
//             console.log(positions[years[i + 1].year] - 50)
//             console.log(scrollTop)
//             if (positions[years[i + 1].year] - 50 > scrollTop) {
//                 break
//             }
//         }

//         setYear(year)
//         setScrollTop(Math.max(
//             document.body.scrollTop,
//             document.documentElement.scrollTop
//         ))
//         setDocumentHeight(Math.max(
//             document.body.scrollHeight,
//             document.body.offsetHeight,
//             document.documentElement.clientHeight,
//             document.documentElement.scrollHeight,
//             document.documentElement.offsetHeight
//         ))
//     }

//     const updatePositions = async () => {
//         const position = (year: number): number => {
//             if (!document || !window) return 0;
//             const element = document.getElementById("year-" + year);
//             if (!element) return 0;
//             const elementPos = element.getBoundingClientRect().top + window.scrollY;
//             return elementPos;
//         }

//         const nextPositions = {} as any;

//         years?.forEach(y => {
//             nextPositions[y.year] = position(y.year)
//         })


//         setPositions(nextPositions)
//     }

//     const goTo = (year: number) => {
//         const topBarHeight = 50;

//         if (!window || !document) return;
//         const element = document.getElementById('year-' + year)
//         if (!element) {
//             return
//         }

//         window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - topBarHeight)
//     }

//     return (
//         <StyledScrollLegend id="ScrollLegend">
//             <Scroller
//                 position={scrollTop / documentHeight * 95 + "%"}
//                 id="YearScroller"
//             >
//                 {year}
//             </Scroller>
//             {years?.map(y =>
//                 <Year
//                     key={"year-" + y.year}
//                     onClick={() => goTo(y.year)}
//                     position={positions[y.year] / documentHeight * 95 + "%"}
//                 >
//                     {y.year}
//                 </Year>
//             )}
//         </StyledScrollLegend>
//     )
// }